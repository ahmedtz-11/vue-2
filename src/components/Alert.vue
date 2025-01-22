<script setup>
import { ref } from 'vue'
defineProps({
  type: {
    type: String,
    default: 'info', // Alert type (e.g., info, success, error)
  },
  message: {
    type: String,
    required: true, // Alert message
  },
});

defineEmits(['close', 'confirm', 'cancel']);

const visible = ref(true);

const closeAlert = () => {
  visible.value = false;
  emit('close');
};

const confirmAction = () => {
  emit('confirm');
};

const cancelAction = () => {
  emit('cancel');
};
</script>



<template>
    <div v-if="visible" :class="`alert alert-${type}`">
      <div class="alert-content">
        <p>{{ message }}</p>
        <div class="alert-actions">
          <button v-if="$slots.confirm || $slots.cancel" @click="confirmAction" id="btn-confirm">Yes</button>
          <button v-if="$slots.confirm || $slots.cancel" @click="cancelAction" id="btn-cancel">No</button>
          <button v-if="!$slots.confirm && !$slots.cancel" @click="closeAlert" class="btn-close"></button>
        </div>
      </div>
    </div>
  </template>
  

  <style scoped>
  .alert {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  /* Alert types */
  .alert-info {
    background-color: #bde7fc;
    color: #0056b3;
    border-left: 5px solid #007bff;
  }
  
  .alert-success {
    background-color: #cdfacd;
    color: #2d7a36;
    border-left: 5px solid #28a745;
  }
  
  .alert-warning {
    background-color: #fff8e6;
    color: #856404;
    border-left: 5px solid #ffc107;
  }
  
  .alert-error {
    background-color: #facdd1;
    color: #721c24;
    border-left: 5px solid #dc3545;
  }
  
  /* Alert content */
  .alert-content {
    text-align: left;
  }
  
  /* Buttons container */
  .alert-actions {
    /* margin-top: 0.5rem; */
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  /* Buttons styles */
  button {
    border: none;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  button:hover {
    transform: translateY(-1px);
  }
  
  /* Button types */
  .btn-close {
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
  }
  
  .btn-close:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
  
  #btn-confirm {
    background-color: #28a745;
    color: #fff;
  }
  
  #btn-confirm:hover {
    background-color: #218838;
  }
  
  #btn-cancel {
    background-color: #dc3545;
    color: #fff;
  }
  
  #btn-cancel:hover {
    background-color: #c82333;
  }
  </style>
  
