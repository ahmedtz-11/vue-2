<script setup>
import { ref, onMounted, watch } from "vue";
import { useProductStore } from "@/stores/product";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const productStore = useProductStore();

const name = ref("");
const category = ref("");
const price = ref("");
const description = ref("");
const status = ref("");
const categories = ref([]);
const statuses = ref(["Available", "Not Available"]);

onMounted(async () => {
  categories.value = await productStore.fetchCategories();

  if (props.product) {
    name.value = props.product.name;
    category.value = props.product.category;
    price.value = props.product.price;
    description.value = props.product.description;
    status.value = props.product.status;
  }
});


const closeModal = () => {
  emit("close");
};
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show d-flex align-items-center justify-content-center fs-5"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.7);"
    >
      <div class="card p-5 w-50 text-capitalize">
        <div class="d-flex justify-content-between mb-2">
          <h3>
            <i class="bi bi-database-check me-2"></i>
            {{ props.product.name }}
          </h3>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="mt-2 text-secondary">
          <p>
            <i class="bi bi-qr-code me-2"></i>ID: <span class="text-dark">{{ props.product.id }}</span> 
          </p>
          <p>
            <i class="bi bi-card-text me-2"></i>Description: <span class="text-dark">{{ props.product.description }}</span> 
          </p>
          <p>
            <i class="bi bi-tags me-2"></i>Category: <span class="text-dark">{{ props.product.category }}</span> 
          </p>
          <p>
            <i class="bi bi-cash-coin me-2"></i>Price: <span class="text-dark">{{ props.product.price }}</span> 
          </p>
          <p>
            <i class="bi bi-info-square me-2"></i>Status: <span class="text-dark">{{ props.product.status }}</span> 
          </p>
        </div>
        
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal {
    font-family: "Nunito Sans", serif;
}
</style>
