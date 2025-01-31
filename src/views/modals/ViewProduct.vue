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
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="card p-4 w-50 w-md-75 w-lg-50 overflow-auto text-capitalize">
        <!-- Header Section -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="mb-0">
            <i class="bi bi-database-check me-2"></i>
            {{ props.product.name }}
          </h3>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>

        <!-- Product Details Section -->
        <div class="text-secondary">
          <!-- Row 1: ID, Category, Price, Status -->
          <div class="row mb-2">
            <div class="col-md-3 mb-3 mb-md-0">
              <p class="mb-1 text-muted small">ID</p>
              <p class="text-dark fw-bold">{{ props.product.id }}</p>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
              <p class="mb-1 text-muted small">Category</p>
              <p class="text-dark fw-bold">{{ props.product.category }}</p>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
              <p class="mb-1 text-muted small">Price</p>
              <p class="text-dark fw-bold">{{ props.product.price }}</p>
            </div>
            <div class="col-md-3 mb-3 mb-md-0">
              <p class="mb-1 text-muted small">Status</p>
              <p
                class="fw-bold"
                :class="
                  props.product.status === 'Available'
                    ? 'text-success'
                    : 'text-danger'
                "
              >
                {{ props.product.status }}
              </p>
            </div>
          </div>

          <!-- Row 2: Description -->
          <div class="row">
            <div class="col-12">
              <div
                class="card bg-light p-3"
                :class="
                  props.product.status === 'Available'
                    ? 'border-success'
                    : 'border-danger'
                "
              >
                <p class="mb-1 text-muted small">Description :</p>
                <p class="text-dark fw-bold mb-0">
                  {{ props.product.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
