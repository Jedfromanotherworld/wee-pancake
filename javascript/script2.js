// Project 2 Specific JavaScript - Task Management App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Task Management App Page Loaded');
    
    // Initialize drag and drop functionality
    initializeDragAndDrop();
    
    // Add animation to feature cards
    animateFeatureCards();
    
    // Add typing effect to project description
    typeWriterEffect();
});

function initializeDragAndDrop() {
    const taskItems = document.querySelectorAll('.task-item');
    const columns = document.querySelectorAll('.task-list');
    
    let draggedItem = null;
    
    // Add event listeners for drag events
    taskItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
        });
    });
    
    // Add event listeners for drop zones
    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
        });
        
        column.addEventListener('dragleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'transparent';
            if (draggedItem) {
                this.appendChild(draggedItem);
                showNotification(`Task moved to ${this.parentElement.querySelector('h4').textContent}`);
            }
        });
    });
}

function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskText = newTaskInput.value.trim();
    
    if (taskText) {
        const todoList = document.getElementById('todo-list');
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.draggable = true;
        taskItem.textContent = taskText;
        
        // Add drag events to new task
        taskItem.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });
        
        taskItem.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
        });
        
        todoList.appendChild(taskItem);
        newTaskInput.value = '';
        showNotification('New task added!');
        
        // Add animation
        taskItem.style.opacity = '0';
        taskItem.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            taskItem.style.transition = 'all 0.3s ease';
            taskItem.style.opacity = '1';
            taskItem.style.transform = 'translateY(0)';
        }, 10);
    }
}

function animateFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

function typeWriterEffect() {
    const description = document.querySelector('.project-description p');
    const text = description.textContent;
    description.textContent = '';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            description.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30);
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 1000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'task-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #64ffda;
        color: #0a192f;
        padding: 1rem 2rem;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add keyboard support for adding tasks
document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});