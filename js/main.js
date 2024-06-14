const dark = document.getElementById('dark');
const light = document.getElementById('light');
const body = document.body;
const apiKey = '6669fbd860a208ee1fdbc352';
const toDoInput = document.getElementById('toDoInput');
const toDoList = document.getElementById('toDoList')
const addBtn = document.getElementById('addBtn');
const loading = document.querySelector('.loading');
let ToDoList = []

function DarkMode(){
    body.classList.add('dark-mode');
    dark.classList.add('d-none');
    light.classList.remove('d-none');
    addBtn.classList.replace("btn-primary" , "btn-success");

    document.querySelectorAll('#task').forEach((task) => {
        task.classList.replace('alert-primary' , 'alert-danger')
    })
   
};

function LightMode(){
    body.classList.remove('dark-mode');
    dark.classList.remove('d-none');
    light.classList.add('d-none');
    addBtn.classList.replace( "btn-success" ,"btn-primary");
    
    document.querySelectorAll('#task').forEach((task) => {
        task.classList.replace('alert-danger' , 'alert-primary')
    })

};

dark.addEventListener('click' , function(){
    DarkMode();
  
    localStorage.setItem("mode" , "dark");

});

light.addEventListener('click' , function(){
    LightMode();
   
    localStorage.setItem("mode" , "light");
});


//TO SAVE LIGHT OR DARK MODE AFTER REFRESH
if(localStorage.getItem('mode') === "dark"){
    DarkMode();
}else{
   LightMode();

};



async function AddToDo(){
    await fetch('https://todos.routemisr.com/api/v1/todos' ,{
        method:'post',
        body:JSON.stringify({
            title : toDoInput.value,
            apiKey: apiKey 
        }),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    });

    GetToDoList();
};


addBtn.addEventListener('click' , function(){
    AddToDo()
    toDoInput.value = ""
});


async function GetToDoList(){

    loading.classList.remove('d-none');

    let data = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
    let response = await data.json();
    ToDoList = response.todos;
    console.log(response.todos);

    DisplayList();

    loading.classList.add('d-none');

}

GetToDoList();

function DisplayList(){
    
    let list = ``;

    for(i=0 ; i<ToDoList.length ; i++){

        list+=`
                <div class="alert alert-primary d-flex justify-content-between" data-id =${ToDoList[i]._id} id="task">
                    <p class="m-0 p-0 ${ToDoList[i].completed?"line-through" : ""} " id="taskContent">${ToDoList[i].title}</p>
                    <div>

                        <span onclick="MarkComplete('${ToDoList[i]._id}')" >
                            ${ToDoList[i].completed?'<i class="fa-solid fa-circle-check" id="complete"></i>' :'<i class="fa-regular fa-circle-check " id="selectToComplete"></i>'}
                        </span>
                        <i class="fa-solid fa-trash text-danger ms-3" onclick="DeleteTask('${ToDoList[i]._id}')"></i>
                    </div>
                </div>
        `
    }

    toDoList.innerHTML=list;

}





async function MarkComplete(id){

    loading.classList.remove('d-none');


    await fetch(`https://todos.routemisr.com/api/v1/todos` , {
        method:"put",
        body:JSON.stringify({
            "todoId":id
         }),
         headers :{ 
            "Content-type": "application/json; charset=UTF-8"
        } 
    });

    GetToDoList()

}


async function DeleteTask(id){

    loading.classList.remove('d-none');

    await fetch(`https://todos.routemisr.com/api/v1/todos`, {
        method:"delete" ,
        body:JSON.stringify({
            "todoId":id 
         }),
         headers :{ 
            "Content-type": "application/json; charset=UTF-8"
        } 
    });

    GetToDoList();
}