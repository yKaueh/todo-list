import { openModal, closeModal, callbackEditModal, callbackDeleteModal, warnEmptyCreateTask } from "./ui.js";
import { renderTasks, addNewTask, toggleTaskStatus, editTask, deleteTask, getTasksStats } from "./tasks.js";

const btnCreateTask =  document.querySelector('#btn-create-task');
const filterContainer = document.querySelector('.filter-container');
const tasksContainer = document.querySelector('#tasks');

let currentTaskElement = null;
let currentTaskData = null;
let localTasks = localStorage.getItem('tasks');
let tasks = localTasks ? JSON.parse(localTasks) : []

function updateApp(){
    renderTasks(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const element = document.querySelector('.tasks-stats');
    const res = getTasksStats(tasks);
    element.textContent = `Pendentes: ${res.undone} | Feitas: ${res.done}`;
}

function handleEnter(){
    const createTaskInput = document.querySelector('#add-task');
    const modalContainer = document.querySelector('.modal-container');
    const modalEditContainer = document.querySelector('#modal-edit');
    const isModalOpen = !modalContainer.classList.contains('hidden');
    const isEditOpen = !modalEditContainer.classList.contains('hidden');
    // Criar task
    if(document.activeElement === createTaskInput){
        const res = addNewTask(tasks)
        if (!res){
            warnEmptyCreateTask();
            return;
        }
        updateApp();
    } else if(isModalOpen && isEditOpen){ // Editar task
        const modalInput = document.querySelector('#modal__input');
        const newName = modalInput.value.trim()
        if(newName){
            currentTaskData.name = newName;
            modalInput.value = '';
            updateApp();
            closeModal('edit');
        }
        currentTaskData = null;
    }
}

function handleEscape(){
    const modalContainer = document.querySelector('.modal-container');
    const modalEditContainer = document.querySelector('#modal-edit');
    const modalConfirmDeleteContainer = document.querySelector('#modal-confirm-delete');
    const isModalOpen = !modalContainer.classList.contains('hidden');
    const isEditOpen = !modalEditContainer.classList.contains('hidden');
    const isDeleteOpen = !modalConfirmDeleteContainer.classList.contains('hidden');
    const modalInput = document.querySelector('#modal__input');
    // Fechar modal
    if(isModalOpen){
        if(isEditOpen){
            modalInput.value = '';
            closeModal('edit');
        }   
        if(isDeleteOpen){
            closeModal('delete');
        }
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if(key === 'Enter'){
        handleEnter();
    } else if(key === 'Escape'){
        handleEscape();
    }
})

document.addEventListener('DOMContentLoaded', () => {
    updateApp();
})

btnCreateTask.addEventListener('click', () => {
    const res = addNewTask(tasks);
    if(!res){
        warnEmptyCreateTask();
        return;
    }
    updateApp();
})

filterContainer.addEventListener('click', (e) => {
    if(e.target.closest('.filter__btn--undone')){
        renderTasks(tasks, 'undone');
    }
    else if(e.target.closest('.filter__btn--done')){
        renderTasks(tasks, 'done');
    }
    else if(e.target.closest('.filter__btn--all')){
        renderTasks(tasks);
    }
})

tasksContainer.addEventListener('click', (e) => {
    // Status
    if(e.target.closest('.task__status')){
        toggleTaskStatus(e, tasks);
        updateApp();
        return;
    }
    // Editar
    else if(e.target.closest('.task__btn--edit')){
        openModal('edit');
        // Edit task + pega task atual
        currentTaskData = editTask(e, tasks);
        return;
    }
    // Deletar
    else if(e.target.closest('.task__btn--delete')){
        openModal('delete');
        currentTaskElement = e.target.closest('.task');
        return;
    }
})

callbackDeleteModal(() => {
        deleteTask(currentTaskElement, tasks);
        currentTaskElement = null;
        updateApp();
})

callbackEditModal((newName) => {
    if(newName){
        currentTaskData.name = newName;
        updateApp();
    }
    currentTaskData = null;
})