<template>
    <div class="todo_list">
        <!-- dev -->
        <div class="test-dev">
            <p class="text-danger">test reactivity system</p>
            <button class="test" @click="listTask.push({complete:false})">add</button>
            <button class="test" @click="listTask.pop()">remove</button>
        </div>

        <!-- TODO LIST -->
        <div class="container mt-5 p-3 rounded bg-light">
            <!-- HEADER -->
            <div class="row header justify-content-center ">
                <h1 class="header__content text-center text-danger">TODO LIST <span class="badge badge-dark">{{numTask}}</span></h1>
            </div>
            <!-- CONTENT -->
            <div class="row justify-content-center ">
                <div class="task col-sm-7 col-10 p-3 ">
                    <!-- Task input -->
                    <div class="task__input input-group mb-3">
                        <input  @keyup.enter="createTask()" type="text" class="form-control" v-model="task" name="" id=""  :placeholder="placeholder.taskInput">
                        <div class="errorMessage" :class="{show:isShow}"> <span>{{errors.task}}</span></div>
                        <!-- Task button -->
                        <div class="input-group-append">
                            <button @click="createTask()" class="btn btn-dark" data-toggle="button" aria-pressed="true" type="button"><span  class="oi oi-plus" title="plus" aria-hidden="true"></span></button>
                            <button @click="task=null" class="btn btn-danger" type="button">Clear</button>
                        </div>
                    </div>
                    <!-- Task Todo -->
                    <div class="task__list-todo mb-3">
                        <h6>Task To-do <span class="badge badge-secondary">{{task_todo}}</span></h6>
                        <div class="task__list-group" v-if="listTask.length" >
                            <ul class="list-group"  v-for="(taskTodo, index) in listTask" :key="taskTodo._id" >
                                <li class="list-group-item" v-if="!taskTodo.complete">
                                    <div class="row" >
                                        <!-- Task Todo content -->
                                        <div class="task__content col-sm-9">
                                            <div class="row" v-if="!taskTodo.isEdit">
                                                <span class="align-middle col-sm-7 " >{{taskTodo.content}} </span>
                                                <span class="col-sm-5  d-flex text-nowrap justify-content-end date">{{formatTimeZone(taskTodo.created_at)}}</span>
                                            </div>
                                            <input v-else @keyup.enter="updateTaskTodo(taskTodo)" type="text" class="form-control" v-model="taskTodo.content">
                                        </div>


                                        <!-- Task Todo content edit-->
                                        <div v-if="!taskTodo.isEdit" class="task__action col-sm-3  btn-group justify-content-end">
                                            <button @click="taskCompleted(taskTodo)" class="btn btn-outline-success" type="button"><span class="oi oi-check" title="pencil" aria-hidden="true"></span></button>
                                            <button @click="taskTodo.isEdit = true" class="btn btn-outline-primary" type="button"><span class="oi oi-pencil" title="pencil" aria-hidden="true"></span></button>
                                            <button @click="deleteTaskTodo(taskTodo, index)" class="btn btn-outline-danger" type="button"><span class="oi oi-trash" title="trash" aria-hidden="true"></span></button>
                                        </div>
                                        <!-- Task Todo button-->
                                        <div v-else class="task__action col-sm-3   btn-group justify-content-end">
                                            <button @click="updateTaskTodo(taskTodo)" class="btn btn-dark" type="button">save</button>
                                            <button @click="getListTask()" class="btn btn-danger" type="button">cancel</button>
                                        </div>

                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                    <!-- Task completed -->
                    <div class="task__list-completed">
                        <h6>Completed Tag <span class="badge badge-success">{{task_completed}}</span></h6>
                        <div class="task__list-group" v-if="listTask.length ">
                            <ul class="list-group"  v-for="(taskCompleted, index) in listTask" :key="taskCompleted._id" >
                                <li class="list-group-item " v-if="taskCompleted.complete" >
                                    <div class="row" >
                                        <!-- Task completed content-->
                                        <div class="task__content col-sm-9">
                                            <div class="row">
                                                <span class="col-sm-7 align-middle">{{taskCompleted.content}}</span>
                                                <span class="col-sm-5 d-flex text-nowrap justify-content-end date">{{formatTimeZone(taskCompleted.updatedAt)}}</span>
                                            </div>
                                        </div>
                                        <!-- Task completed button-->
                                        <div class="task__action col-sm-3 btn-group justify-content-end">
                                            <button @click="deleteTaskTodo(taskCompleted,index)" class="btn btn-outline-danger" type="button"><span class="oi oi-trash" title="trash" aria-hidden="true"></span></button>
                                        </div>

                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script >
import moment from 'moment-timezone'
import axios from 'axios'
    export default {
        data(){
            return {
                task: null,
                placeholder: {
                    taskInput: "Add new task"
                },
                listTask: [],
                task_todo:0,
                task_completed:0,
                errors:{
                    task:null,
                },
                isShow: false,
            }
        },
        created(){
            this.getListTask();
        },
        methods:{
            createTask() {
                //  Jsonp fix prelight res server nodejs
                // $.ajax({
                //   url: "http://localhost:3000/task",
                //   method: "POST",
                //   dataType: "json",
                //   data: {
                //     "task": "abc"
                //   },
                //   success: function( data, status, jqxhr ){
                //     console.log( "Request received:", data );
                //   },
                //   error: function( jqxhr, status, error ){
                //     console.log( "Something went wrong!",error );
                //   }
                // });

                if(this.checkRequiredContentTask&&this.task!==null){
                    axios.post('http://localhost:3000/task',{ task:this.task })
                    .then(response => {
                        console.log(response.data);
                        this.getListTask();
                        this.task=null;
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            },
            getListTask(){
                axios.get('http://localhost:3000/task')
                .then(response => {
                    console.log(response.data)
                    this.listTask = response.data
                    this.listTask.forEach(taskTodo => {
                        this.$set(taskTodo, 'isEdit', false)
                    })
                });
            },
            formatTimeZone(fulltime=null){
                let result="";
                if(fulltime){
                    var date = moment(fulltime);
                    result = date.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
                }
                else{
                    result=moment().format('YYYY-MM-DD HH:mm:ss');
                }

                return result;
            },
            taskCompleted(taskTodo){
                taskTodo.complete=true;
                this.task_todo--;
                axios.put('http://localhost:3000/task/'+taskTodo._id, { complete: taskTodo.complete})
                .then(response => {

                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                });
            },
            updateTaskTodo(taskTodo){
                taskTodo.isEdit=false;
                axios.put('http://localhost:3000/task/'+taskTodo._id, {content: taskTodo.content})
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                });
            },
            deleteTaskTodo(taskTodo, index){
                axios.delete('http://localhost:3000/task/'+taskTodo._id)
                .then(response => {
                    this.listTask.splice(index, 1);
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                });
            }
        },
        computed: {
            numTask(){
                return this.listTask.length;
             },
            checkRequiredContentTask() {
                this.errors = { task: null};
                if (this.task=== "") {
                    this.errors.task = 'Task required.';
                    this.isShow=true;
                    return false;
                }else{
                    this.isShow=false;
                }
                return true
            }
        },
        watch:{
            numTask(){
                //when numTask chane then handle count task_todo and task_complete
                //*console.log('numTask computed changed');
                let sum=0;
                for( let value of this.listTask){
                    if(value.complete==false)
                       sum++;
                }
                this.task_todo=sum;
                this.task_completed=this.numTask-this.task_todo;
            },
            task_todo:{
                 //when task_todo chane then handle count task_complete
                handler: function() {
                    this.task_completed=this.numTask-this.task_todo;
                },
                deep: true
            },
            task_completed:{
                //when task_complete chane then handle count task_todo
                handler: function() {
                    this.task_todo=this.numTask-this.task_completed;
                },
                deep: true
            }
        },
        updated(){
            this.checkRequiredContentTask;
        },

    };
</script>
<style lang="css" scoped>
    .test-dev{
        position: relative;
        top:200px;
        max-width: 300px;
        max-width: 300px;
    }
    .errorMessage{
        width: 200px;
        height: 30px;
        display: none;
        visibility: hidden;
        background: #343a40;
        color: white;
        position:absolute;
        bottom:100%;
        margin-bottom: 10px;
        -webkit-border-radius: 5px;
                border-radius: 5px;
        opacity: 0.9;
        -ms-text-align-last: center;
            text-align-last: center;

    }
    .errorMessage span{
       vertical-align: middle;
    }
    .errorMessage::after{
        content: "";
        width: 13px;
        display: block;
        height: 13px;
        background: #343a40;
        margin-top:-3px;
        margin-left: 50%;
        transform: rotate(45deg) translate(-50%,+50%);
    }
    .errorMessage.show {
        display: block;
        visibility: visible;
    }
</style>
