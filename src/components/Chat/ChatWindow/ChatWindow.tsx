import "./ChatWindow.css";
export const ChatWindow = () => {

    return (
        <div className="container py-4">
    <div className="row">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <span className="d-inline-flex"><i className="bi bi-people-fill h4 mx-2"></i><h4>Users</h4></span>
          </div>
          <div className="card-body">
            <ul className="list-group">
              <li className="list-group-item">John Doe</li>
              <li className="list-group-item">Jane Doe</li>
              <li className="list-group-item">Bob Smith</li>
              {/* <!-- Add more contacts here --> */}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h4>Chat with John Doe</h4>
          </div>
          <div className="card-body chat-container">
            <div className="mb-3">
              <div className="d-flex justify-content-end">
                <div className="bg-primary text-white p-2 rounded">
                  <p>Hello, how can I help you?</p>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-start">
                <div className="bg-secondary text-white p-2 rounded">
                  <p>Hi, I have a question about your product.</p>
                </div>
              </div>
            </div>
            {/* <!-- Add more messages here --> */}
          </div>
          <div className="card-footer">
            <form>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Type your message..." />
                <button type="submit" className="btn btn-primary"><i className="bi bi-send" style={{fontSize:"30px"}}></i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
}

