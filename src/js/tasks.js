export function renderTasks(tasks, filter=''){
    const tasksContainer = document.querySelector('#tasks');
    const tasksJSON = JSON.stringify(tasks)

    // Container de tasks vai zerar para poder renderizar conteúdo certo
    tasksContainer.innerHTML = '';
    const tasks_to_show = filter
        ? tasks.filter(task => task.status === filter)
        : tasks;
    if(tasks_to_show.length !== 0){
        // Ordenar se nao tem filter
        if(!filter){
            tasks_to_show.sort((a, b) => {
                if (a.status === b.status) return 0;
                if(a.status === 'undone') return -1;
                return 1;
            })
        }

        tasks_to_show.forEach((item) => {
                const {id, name, status} = item;
                const div = document.createElement('div');
                const svgStatusIcon = `
                <svg viewBox="0 0 24 24" class="icon" fill="currentColor">
                        <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" stroke-width="1.5"></path>
                        <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                `
    
                div.classList.add('task');
                if(item.status === 'done'){
                    div.classList.add('task--done');
                } else{
                    div.classList.add('task--undone');
                }
                div.setAttribute('data-id', id);
    
                div.innerHTML = `
                        <div class="task-info">
                            <p class="task__name">${name}</p>
                            <span class="task__status" data-status="${status}">
                                ${svgStatusIcon}
                            </span>
                        </div>
                        <div class="task-btn-container">
                            <button class="task__btn task__btn--edit">EDITAR</button>
                            <button class="task__btn task__btn--delete">DELETAR</button>
                        </div>
                `;
                tasksContainer.appendChild(div)
            })
    } else{
        const text = document.createElement('p');
        text.classList.add('tasks-container-empty-state');
        if(!filter) text.innerText = 'Nenhuma tarefa aqui...';
        else if(filter === 'done') text.innerText = "Nenhuma tarefa feita...";
        else text.innerText = 'Nenhuma tarefa pendente...';
        tasksContainer.appendChild(text);
    }
}

export function addNewTask(tasks){
    const inputAddTask = document.querySelector('#add-task');
    const name = inputAddTask.value.trim();
    // Responder que não tem new task
    if(!name){
        return false;
    }

    // Criar tarefa nova
    const newTask = {
        id: Date.now(),
        name: name,
        status: 'undone'
    };

    tasks.push(newTask)
    // - Renderizar tarefas novamente no html
    renderTasks(tasks);
    // Zerar input
    inputAddTask.value = '';
    // Focar no input
    const element = document.querySelector(`[data-id="${newTask.id}"]`);
    element.focus();
    element.scrollIntoView({behavior: "smooth", block:"center"});
    // Responder que existe new task
    return true;
}

export function toggleTaskStatus(e, tasks){
        // Altera status da task
        const taskElement = e.target.closest('.task');
        const task = tasks.find(item => item.id === Number(taskElement.dataset.id));
        task.status = (task.status === 'done') ? 'undone' : 'done';
}

export function deleteTask(taskElement, tasks){
    const task = tasks.find(item => item.id === Number(taskElement.dataset.id))
    // Encontra index de task
    const index = tasks.findIndex(i => i.id === task.id);
    // Exclui task no index encontrado
    tasks.splice(index, 1);
}

export function editTask(e, tasks){
    const taskElement = e.target.closest('.task');
    const task = tasks.find(item => item.id === Number(taskElement.dataset.id));
    const modalInput = document.querySelector('#modal__input');
    
    // Coloca conteudo da task no input
    modalInput.value = task.name;
    // Foca no input
    modalInput.focus()
    // Passar task pro global
    return task;
}

export function getTasksStats(tasks){
    // Retorna quantidade de tarefas feitas e pendentes
    let done = 0;
    let undone = 0;
    tasks.forEach((task) => {
        if(task.status === 'done') done++;
        else undone++;
    })

    return {"done":done, "undone":undone};
}
