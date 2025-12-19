const modalContainer = document.querySelector('.modal-container');
const modalEditContainer = document.querySelector('#modal-edit');
const modalConfirmDeleteContainer = document.querySelector('#modal-confirm-delete');
const modalInput = document.querySelector('#modal__input');


export function openModal(modalType){
    modalContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if(modalType === 'edit'){
        modalEditContainer.classList.remove('hidden');
    } else if(modalType === 'delete'){
        modalConfirmDeleteContainer.classList.remove('hidden');
    }
}
export function closeModal(modalType){
    modalContainer.classList.add('hidden');
    document.body.style.overflow = '';
    if(modalType === 'edit'){
        modalEditContainer.classList.add('hidden');
    } else if(modalType === 'delete'){
        modalConfirmDeleteContainer.classList.add('hidden');
    }
}

export function callbackDeleteModal(onConfirmDelete){
    modalConfirmDeleteContainer.addEventListener('click', (e) => {
    // Confirmou
    if(e.target.closest('.modal__btn--delete')){
        onConfirmDelete();
    }
    if(e.target.closest('.modal__btn--delete') || e.target.closest('.modal__btn--cancel')){
        closeModal('delete');
    }
})
}

export function callbackEditModal(onConfirmEdit){
    modalEditContainer.addEventListener('click', (e) => {
        // Save
        if(e.target.closest('.modal__btn--save')){
            onConfirmEdit(modalInput.value.trim())
        }
        // Se clicou em um dos botoes ou Cancel
        if(e.target.closest('.modal__btn--cancel') || 
        e.target.closest('.modal__btn--save')){
            modalInput.value = '';
            closeModal('edit');
        }
    })
}

export function warnEmptyCreateTask(){
    const warnElement = document.querySelector('.warn-empty-create-task');

    warnElement.classList.remove('hidden');
    warnElement.classList.remove('show');
    void warnElement.offsetWidth;
    warnElement.classList.add('show');
    setTimeout(() =>{
        warnElement.classList.remove('show');
        warnElement.classList.add('hidden');
    }, 1500)
}