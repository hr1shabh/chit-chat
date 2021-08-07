import './Input.css';
const Inout = ({message, setMessage, sendMessage}) => {
    return ( 
        <form className = "form">
        <input
        className="input"
        type ="text"
        placeholder="type a message" 
        value={message} 
        onChange={(event) => setMessage(event.target.value)} 
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}></input>
        <button className = "sendButton" onClick = {(e) =>{sendMessage(e)}}>Send</button>
        </form>
     );
}
 
export default Inout;