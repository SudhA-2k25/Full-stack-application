import { useEffect, useState } from "react"
import './App.css';
import './index.css';

const apiUrl = "https://todo-7fczc3c6u-sudha-2k25s-projects.vercel.app/";

export default function Todo(){
        {/* useState s*/}
    const [title , setTitle] = useState("");
    const [description , setDescription] = useState("");
    const [todos , setTodos] = useState([]);
    const [error , setError] = useState("");
    const [message , setMessage] = useState("");
    const [editId , setEditId] = useState(-1); // by default ist will be -1
    const apiUrl = "http://localhost:8000"

    // Edit
    const [editTitle , setEditTitle] = useState("");
    const [editDescription , setEditDescription] = useState("");


// handle submit
    const handleSubmit = () => {

        setError("") // while submitting theree shdnt be any error
        // check input values empty or not // trim - remove white spaces
        if (title.trim() !== '' && description.trim() !== ''){
            // for creating an item , vve to send request to backend
            fetch(apiUrl+"/todos", {
                method : "POST",
                headers : {        // as it is a json data
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({title , description}) /*v cant send json data direectly so using stringify */
            }) .then( (res) => {
                if(res.ok){
                    // add item to list
                    setTodos([...todos, {title, description}])
                    setTitle("");
                    setDescription("");
                    setMessage("Item Added Sucessfully")
                    setTimeout( () =>{
                        setMessage("");
                    }, 5000)

                } else{
                    // set error
                    setError("Unable to create  ToDo Item")
                }

            }) .catch( () =>{
                setError("Unable to create ToDo Item")
            })
            
            
        }
    }

    useEffect(() =>{
        getItems() // while refreshing the site
    }, [])

    // to get todo items
    const getItems = () =>{
        fetch(apiUrl+"/todos")
        .then( (res)  => res.json())
        .then( (res) =>{
            setTodos(res)
        })
    }

// handle edit
    const handleEdit = (item) =>{
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description);
    }

    // Cancel button
    const handleEditCancel = () =>{
        setEditId(-1)
    }

    // Update
    const handleUpdate = () =>{

        setError("") // while submitting theree shdnt be any error
        // check input values empty or not // trim - remove white spaces
        if (editTitle.trim() !== '' && editDescription.trim() !== ''){
            // for creating an item , vve to send request to backend
            fetch(apiUrl+"/todos/"+editId, {
                method : "PUT",
                headers : {        // as it is a json data
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({title: editTitle , description : editDescription})
            }) .then( (res) => {
                if(res.ok){
                    // UPDATE item to list

                    const updatedTodos = todos.map( (item) =>{
                        if (item._id == editId){ 
                 // for update
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    setTitle("");
                    setDescription("");
                    setMessage("Item Updated Sucessfully")
                    setTimeout( () =>{
                        setMessage("");
                    }, 5000)

                    setEditId(-1) // for the edit to get closed

                } else{
                    // set error
                    setError("Unable to Update ToDo Item")
                }

            }) .catch( () =>{
                setError("Unable to Update ToDo Item")
            })
            
            
        }
    }

    // Delete button // confirm = creates a pop and asks ques
    const handleDelete = (_id) =>{
        if (window.confirm(' Are you sure want to delete ?')){
            fetch(apiUrl+'/todos/'+_id , {
                method : "DELETE"
            })
            .then( () =>{ // removing the deleted item , filtering out done
                const  filteredTodos = todos.filter( (item) => item._id !== _id)
                setTodos(filteredTodos)
            })

        }

    }



    return <> {/*only one div*/}

    <div className="row p-3 bg-success text-dark"> {/* Haeding */}
        <h1>ToDo project with MERN stack</h1>
    </div>
    <div className="row">

        <h3>Add Items</h3>
        {message && <p className="text-success">{message}</p> }
        <div className="form-group d-flex gap-2"> {/* d-flex to move to right */}
            <input placeholder="title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" /> 
            <input placeholder="description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text" />
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
         
        {error && <p className="text-danger"> {error} </p> }


    </div>


    <div className="row mt-3"> {/* mt- margin top */}
        <h3>Tasks</h3>

            <div className="col-md-6"> {/* mx-auto - to align in center , it adds margin equally in left and right */}
{/* column for medium sized screen ... out of 12 here 6 only v take as size*/}
            <ul className="list-group">
            {
            todos.map( (item) => <li className="list-group-item bg-info d-flex justify-content-between align-items-center mt-2">
            <div className="d-flex flex-column me-2">

                {
                    editId == -1 || editId !== item._id ? <>

                        <span className="fw-bold">{item.title}</span>
                        <span>{item.description}</span>
                    </> : <>
                    <div className=" d-flex gap-2">
                    <input placeholder="title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text" /> 
                    <input placeholder="description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                    </div>
                    </>
                }

                
            </div>
                
            <div className="d-flex gap-2">
                {editId == -1 ?<button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> : <button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                {editId == -1 ? <button className="btn btn-danger" onClick={ () => handleDelete(item._id)}>Delete</button> :
                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
            </div>
                
        </li> 
        
        )

            }
            
        </ul>

            </div>

        
    </div>

    </>
}
