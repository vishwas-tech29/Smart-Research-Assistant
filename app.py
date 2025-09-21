import streamlit as st
from pdfminer.high_level import extract_text
from transformers import pipeline, set_seed
import io

# --- Configuration ---
# Models can be heavy, so load them once and cache them.
# The 'st.cache_resource' decorator is suitable for objects that should be reused across sessions.

@st.cache_resource
def load_summarizer_model():
    """Loads the summarization pipeline."""
    # Using a smaller model for faster loading times
    return pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", framework="pt")

@st.cache_resource
def load_qa_model():
    """Loads the question-answering pipeline."""
    # Using a smaller, optimized model for QA
    return pipeline("question-answering", model="distilbert/distilbert-base-uncased-distilled-squad", framework="pt")

@st.cache_resource
def load_question_generator_model():
    """Loads the text generation pipeline for question generation."""
    # GPT-2 is used for demonstration; larger models would be better.
    # Set pad_token_id to eos_token_id to suppress warnings about padding token.
    generator = pipeline("text-generation", model="gpt2")
    generator.model.config.pad_token_id = generator.tokenizer.eos_token_id
    return generator

# Load models outside the main app loop
summarizer = load_summarizer_model()
qa_model = load_qa_model()
question_generator = load_question_generator_model()

# --- Utility Functions ---

def extract_pdf_text(uploaded_file):
    """Extracts text from a PDF file."""
    try:
        # pdfminer.six expects a file-like object, so pass the BytesIO object
        return extract_text(io.BytesIO(uploaded_file.getvalue()))
    except Exception as e:
        st.error(f"Error extracting text from PDF: {e}")
        return None

def process_uploaded_document(uploaded_file):
    """Processes the uploaded document based on its type."""
    if uploaded_file.type == "application/pdf":
        text = extract_pdf_text(uploaded_file)
    elif uploaded_file.type == "text/plain":
        text = uploaded_file.getvalue().decode("utf-8")
    else:
        st.error("Unsupported file type. Please upload a PDF or TXT document.")
        return None
    return text

def generate_summary(text):
    """Generates a concise summary of the text."""
    if not text:
        return "Cannot generate summary for empty content."
    try:
        # Truncate text if it's too long for the summarizer model (typically max 1024 tokens)
        # For simplicity, we'll just take the first N characters. A proper solution would use chunking.
        max_input_length = 1000 # Approximation, depends on model tokenizer
        truncated_text = text[:max_input_length] if len(text) > max_input_length else text

        summary = summarizer(truncated_text, max_length=150, min_length=50, do_sample=False)
        return summary[0]["summary_text"]
    except Exception as e:
        st.error(f"Error generating summary: {e}")
        return "Summary generation failed."

def answer_question(context, question):
    """Answers a question based on the provided context."""
    if not context or not question:
        return {"answer": "Please upload a document and ask a question.", "score": 0.0}
    try:
        # QA models also have context limits. For a real app, use RAG.
        max_context_length = 500 # Approximate, depends on model tokenizer
        truncated_context = context[:max_context_length] + "..." if len(context) > max_context_length else context
        
        answer = qa_model(question=question, context=truncated_context)
        return answer
    except Exception as e:
        st.error(f"Error answering question: {e}")
        return {"answer": "Could not answer the question.", "score": 0.0}

def generate_logic_questions(document_text, num_questions=3):
    """Generates logic-based or comprehension questions from the document."""
    if not document_text:
        return ["Please upload a document to generate questions."]
    
    questions = []
    set_seed(42) # for reproducibility of generation
    
    # Take a snippet of the document to guide question generation
    # GPT-2 has a max input of 1024 tokens, so we need to be careful with context size.
    # For better results, you might need a more advanced question generation model or technique.
    prompt_context_length = min(len(document_text), 500) 
    context_snippet = document_text[:prompt_context_length]
    
    for i in range(num_questions):
        prompt = f"Based on the following document snippet, generate a challenging comprehension or logic-based question:\n\n{context_snippet}\n\nQuestion:"
        try:
            # Generate text, then try to extract a single question
            # Using num_return_sequences=1 to get one generation per call
            # max_new_tokens controls the length of the generated question
            generated_text = question_generator(prompt, max_new_tokens=50, num_return_sequences=1, do_sample=True)[0]['generated_text']
            
            # Simple post-processing to extract a plausible question
            question_text = generated_text.replace(prompt, "").strip()
            # Try to stop at a question mark or new line
            if '?' in question_text:
                question_text = question_text.split('?')[0] + '?'
            elif '\n' in question_text:
                question_text = question_text.split('\n')[0].strip()
            
            if question_text and len(question_text) > 10: # Basic filter for meaningful questions
                questions.append(question_text)
            else:
                questions.append(f"Could not generate a meaningful question {i+1}.")
                
        except Exception as e:
            st.warning(f"Error generating question {i+1}: {e}")
            questions.append(f"Failed to generate question {i+1}.")
            
    return questions

def evaluate_answer(user_answer, generated_question, document_context):
    """
    Evaluates the user's answer against a 'correct' answer derived from the document.
    This is a simplified evaluation.
    """
    if not user_answer or not generated_question or not document_context:
        return "Please provide all necessary inputs for evaluation."

    # Get the "correct" answer from the document using the QA model
    # This acts as our ground truth
    correct_qa_result = answer_question(document_context, generated_question)
    correct_answer_text = correct_qa_result.get("answer", "").strip()

    feedback = ""
    is_correct = False

    if not correct_answer_text:
        feedback = "Could not determine a correct answer from the document for this question."
    else:
        # Simple string matching for evaluation.
        # For a more robust solution, use NLP similarity (e.g., Sentence-BERT, Jaccard similarity)
        # or compare extracted entities/keywords.
        if user_answer.lower() in correct_answer_text.lower() or \
           correct_answer_text.lower() in user_answer.lower():
            feedback = "Correct! Your answer aligns with the document."
            is_correct = True
        else:
            feedback = "Incorrect. Your answer does not seem to align with the document."
        
        feedback += f"\n\nDocument's likely answer: \"{correct_answer_text}\""
        # Attempt to find a reference for the correct answer
        if "start" in correct_qa_result and "end" in correct_qa_result:
            start = correct_qa_result["start"]
            end = correct_qa_result["end"]
            # To provide a snippet, we need the *original* context that was passed to the QA model.
            # In this simple example, we'll try to find it in the full document context.
            # A more robust solution would store and retrieve the exact segment.
            context_snippet_start = max(0, start - 100) # Show 100 chars before
            context_snippet_end = min(len(document_context), end + 100) # Show 100 chars after
            document_reference = document_context[context_snippet_start:context_snippet_end]
            feedback += f"\n\nReference snippet from document:\n\n`...{document_reference.strip()}...`"

    return feedback, is_correct


# --- Streamlit UI ---
st.set_page_config(layout="wide", page_title="Smart Research Assistant")

st.title("📚 Smart Research Assistant")
st.markdown("Upload a document (PDF or TXT) to get a summary, ask questions, or challenge your comprehension!")

# --- Document Upload Section ---
st.header("1. Upload Document")
uploaded_file = st.file_uploader("Choose a PDF or TXT document", type=["pdf", "txt"])

document_text = None
if uploaded_file is not None:
    with st.spinner("Processing document..."):
        document_text = process_uploaded_document(uploaded_file)
    
    if document_text:
        st.success("Document uploaded and processed successfully!")
        st.session_state['document_text'] = document_text # Store in session state
        
        # --- Auto Summary ---
        st.subheader("Document Summary")
        with st.spinner("Generating summary..."):
            summary = generate_summary(document_text)
            st.info(summary)
    else:
        st.session_state['document_text'] = None
        st.error("Failed to process document. Please try again.")
else:
    st.session_state['document_text'] = None


# --- Interaction Modes ---
if st.session_state.get('document_text'):
    st.header("2. Interact with the Document")
    
    mode = st.radio(
        "Choose Interaction Mode:",
        ("Ask Anything", "Challenge Me"),
        index=0, # Default to "Ask Anything"
        key="interaction_mode"
    )

    # --- Ask Anything Mode ---
    if mode == "Ask Anything":
        st.subheader("Ask Anything About the Document")
        user_question = st.text_area("Enter your question here:", key="ask_question_input")
        
        if st.button("Get Answer", key="ask_button"):
            if user_question:
                with st.spinner("Finding answer..."):
                    qa_result = answer_question(st.session_state['document_text'], user_question)
                    answer = qa_result.get("answer", "No answer found in the document.")
                    score = qa_result.get("score", 0.0)

                    st.write(f"**Answer:** {answer}")
                    st.markdown(f"*(Confidence: {score:.2f})*")
                    
                    # Provide justification by finding the answer span
                    # The QA model directly provides start/end indices for the answer in the context it received.
                    # We need to use those to show the original context.
                    if "start" in qa_result and "end" in qa_result:
                        start_idx = qa_result["start"]
                        end_idx = qa_result["end"]
                        # Get a broader snippet for context
                        context_snippet_start = max(0, start_idx - 150)
                        context_snippet_end = min(len(st.session_state['document_text']), end_idx + 150)
                        justification_text = st.session_state['document_text'][context_snippet_start:context_snippet_end]
                        
                        st.subheader("Justification (Context from Document):")
                        # Highlight the answer if possible (Streamlit doesn't have direct highlighting)
                        # A simple bolding or f-string could work.
                        highlighted_justification = justification_text[:(start_idx - context_snippet_start)] + \
                                                  "**" + justification_text[(start_idx - context_snippet_start):(end_idx - context_snippet_start)] + "**" + \
                                                  justification_text[(end_idx - context_snippet_start):]
                        st.markdown(f"> ...{highlighted_justification.strip()}...")
                    else:
                        st.write("No specific section could be referenced for this answer.")
            else:
                st.warning("Please enter a question.")

    # --- Challenge Me Mode ---
    elif mode == "Challenge Me":
        st.subheader("Challenge Your Comprehension")
        
        if 'generated_questions' not in st.session_state or st.button("Generate New Questions", key="generate_q_button"):
            with st.spinner("Generating challenges..."):
                st.session_state['generated_questions'] = generate_logic_questions(st.session_state['document_text'])
                st.session_state['user_answers'] = [""] * len(st.session_state['generated_questions'])
                st.session_state['evaluation_feedback'] = [""] * len(st.session_state['generated_questions'])

        if st.session_state.get('generated_questions'):
            st.write("Answer the following questions based on the document:")
            
            for i, q in enumerate(st.session_state['generated_questions']):
                st.markdown(f"**Question {i+1}:** {q}")
                
                # Use a unique key for each text_area in the loop
                st.session_state['user_answers'][i] = st.text_area(f"Your Answer for Q{i+1}:", value=st.session_state['user_answers'][i], key=f"user_ans_{i}")
                
                if st.button(f"Evaluate Answer {i+1}", key=f"evaluate_btn_{i}"):
                    with st.spinner("Evaluating your answer..."):
                        feedback, is_correct = evaluate_answer(
                            st.session_state['user_answers'][i],
                            q,
                            st.session_state['document_text']
                        )
                        st.session_state['evaluation_feedback'][i] = feedback
                        if is_correct:
                            st.success(feedback)
                        else:
                            st.error(feedback)
                
                # Display stored feedback if available
                if st.session_state['evaluation_feedback'][i]:
                    if "Correct!" in st.session_state['evaluation_feedback'][i]:
                        st.success(st.session_state['evaluation_feedback'][i])
                    elif "Incorrect" in st.session_state['evaluation_feedback'][i]:
                        st.error(st.session_state['evaluation_feedback'][i])
                    else:
                        st.info(st.session_state['evaluation_feedback'][i])
                st.markdown("---") # Separator
        else:
            st.warning("No questions generated. Upload a document first and click 'Generate New Questions'.")
else:
    st.info("Upload a document to enable interaction modes.")

st.markdown("---")
st.caption("Built with Streamlit and Hugging Face Transformers.")