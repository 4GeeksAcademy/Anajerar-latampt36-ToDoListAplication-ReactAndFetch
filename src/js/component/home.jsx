import React, { useEffect, useState } from "react";

//create your first component

const Home = () => {
let toDoObjArray =[]
const [toDo,setToDo] = useState([]);
const [inputValue, setInputValue] = useState('');
const [countTask, setCountTask] = useState("No task left, add a task")

useEffect (()=>{
				async function initialSetup () {
					const user = await apiCall('https://playground.4geeks.com/todo/users/Anajerar',
						{method: 'POST',
						headers: {'accept':'application/JSON'}},201);
					const userTaskList = await apiCall('https://playground.4geeks.com/todo/users/Anajerar',
						{method : 'GET',
						headers : {'accept': 'application/json'}},200)
					    toDoObjArray=userTaskList.todos;
					if (toDoObjArray.length >0) {
						toDoObjArray.length == 1 ? setCountTask("1 task left") : setCountTask(toDoObjArray.length+" tasks left")
						setToDo(toDoObjArray)
						}; 
				}
				initialSetup()			
},[]);

async function apiCall(uri,hdrs,success) {
    try{ const response = await fetch (uri,hdrs);
        if (response.status !== success){throw new Error (`error code ${response.code}`)}
        const body = await response.json();
        return body;    
        }
    catch(error){
        return null
                }
    }

async function deleteTask(e){
		let taskId = e.target.parentNode.id
		let uri ='https://playground.4geeks.com/todo/todos/'+taskId;
		let parameters = {method : 'DELETE',
					headers : {'accept': 'application/json'}
					}
		const confirm = await apiCall(uri,parameters,204);
		uri="https://playground.4geeks.com/todo/users/Anajerar"
		const useTask = await apiCall(uri,{method:'GET'},200);
		toDoObjArray=useTask.todos
		toDoObjArray.length == 1 ? setCountTask("1 task left") : setCountTask(toDoObjArray.length+" tasks left")
		toDoObjArray==0 ? setCountTask("No task left, add a task") : null
		setToDo(toDoObjArray)
	}

async function keyHandler(e) {
	if (e.key==='Enter') {
		if (e.target.value != ""){
			const parameters = {
								method : 'POST',
								body: '' ,
								headers: {'accept':'application/json',
										'Content-type':'application/json'}
								};
			parameters.body = JSON.stringify({label:inputValue,'is-done':false});
			const newTask = await apiCall('https://playground.4geeks.com/todo/todos/Anajerar',parameters,201);
			const userTaskList = await apiCall('https://playground.4geeks.com/todo/users/Anajerar',
				{method : 'GET',
				headers : {'accept': 'application/json'}},200);
				toDoObjArray=userTaskList.todos;
			if (toDoObjArray.length >0) {
				toDoObjArray.length == 1 ? setCountTask("1 task left") : setCountTask(toDoObjArray.length+" tasks left");
				setToDo(toDoObjArray);
				e.target.value="";
				setInputValue("");
				}
			}
		}
	}

async function deleteAll(e) {
	let uri="https://playground.4geeks.com/todo/users/Anajerar"
	let parameters = {method : 'DELETE',
					headers : {'accept': 'application/json'}}
	const confirm = await apiCall(uri,parameters,204);
	setToDo([]);
	setCountTask("No task left, add a task")
	alert('User and tasks were deleted')
	const user = await apiCall('https://playground.4geeks.com/todo/users/Anajerar',
		{method: 'POST',
		headers: {'accept':'application/JSON'}},201);
	}

function showDel(e){
	if (e.target.childNodes[1]){
		e.target.childNodes[1].hidden=false }
}

function hideDel(e){
	if (e.target.childNodes[1]) {
		e.target.childNodes[1].hidden=true }
}

function showX(e) {
	e.target.hidden=false
}

function hideX(e){
	e.target.hidden=true
}

	return (
		<>
			<h1 className="text-center">ToDos</h1>
			<div className="m-auto tabs-borders">
				<input className="m-4 ps-2" placeholder="What needs to be done?"
				name="taskInput"
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={ keyHandler }/>
			</div>
				
				<ul className="list-group list-group-flush tabs-borders">
					{toDo.map((task,indx)=>{
						return (	
							<li className="list-item d-flex justify-content-between mt-2 pb-2" key={task.id} id={task.id}
								onMouseOver={ showDel } onMouseOut={ hideDel }>
								<span className="ps-4">{task.label}</span>
								<button type="button" className="btn-close pe-5" aria-label="Close"
									onClick={ deleteTask } hidden={true} 
									onMouseOver={ showX } onMouseOut={ hideX }></button>
							</li>								
								)
						    })
					}						
				</ul>			
				<p>{ countTask }</p>
			<div className="small-div" style={{width:"49%"}}></div>
			<div className="small-div" style={{width:"48%"}}></div>
			<div className="d-flex justify-content-center m-3 p-3">
				<button type="button" className="btn btn-dark" onClick={deleteAll}>Delete user and tasks</button>
			</div>
		</>
	);
};

export default Home;
