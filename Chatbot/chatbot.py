import streamlit as st
from langchain.llms import HuggingFaceHub
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.callbacks.base import BaseCallbackHandler

class StreamHandler(BaseCallbackHandler):
    def __init__(self, container, initial_text=""):
        self.container = container
        self.text = initial_text

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.text += token
        self.container.markdown(self.text)

@st.cache_data()
def create_chain(system_prompt):
    api_token = "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" 
    repo_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"   
    llm = HuggingFaceHub(repo_id=repo_id, huggingfacehub_api_token=api_token)
    template = "{system_prompt} {question}"
    prompt = PromptTemplate(template=template, input_variables=["system_prompt", "question"])
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    return llm_chain

# Set the page configuration
st.set_page_config(page_title="Your own aiChat!")

# Add CSS for the body element to apply the linear gradient background
st.markdown(
    """
    <style>

    .appview-container{
    background: linear-gradient(45deg, #1E407E, #484797, #4E2A6D);
    }
    body {
        
        
        color: white;
    }
    .chat-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 300px;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 10px;
        z-index: 1000;
        color: black;
    }
    .chat-header {
        font-weight: bold;
        margin-bottom: 10px;
    }
    .chat-input {
        width: 100%;
        padding: 5px;
        margin-top: 10px;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Chat container
st.markdown('<div class="chat-container">', unsafe_allow_html=True)

# Chat header
st.markdown('<div class="chat-header">Your own aiChat!</div>', unsafe_allow_html=True)

# System prompt
system_prompt = st.text_area(
    label="System Prompt",
    value="You are a helpful AI assistant who answers questions in short sentences.",
    key="system_prompt"
)

# Create the LLM chain
llm_chain = create_chain(system_prompt)

if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "How may I help you today?"}]

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User input
user_prompt = st.text_input("Your message here", key="user_input", help="Type your message here and press Enter", label_visibility="collapsed")
if user_prompt:
    st.session_state.messages.append({"role": "user", "content": user_prompt})
    formatted_prompt = {"system_prompt": system_prompt, "question": user_prompt}
    assistant_response = llm_chain.invoke(formatted_prompt)
    st.session_state.messages.append({"role": "assistant", "content": assistant_response})
    with st.chat_message("assistant"):
        st.markdown(assistant_response['text'])

st.markdown('</div>', unsafe_allow_html=True)
