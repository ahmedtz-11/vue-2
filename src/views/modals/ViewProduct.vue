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
      class="modal fade show"
      tabindex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Header Section -->
          <div class="modal-header">
            <h3 class="modal-title text-capitalize" id="productModalLabel">
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

          <!-- Body Section -->
          <div class="modal-body fs-5">
            <div class="row text-secondary">
              <!-- ID, Category, Price, Status -->
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">ID</p>
                <p class="text-dark fw-bold">{{ props.product.id }}</p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Category</p>
                <p class="text-dark fw-bold">{{ props.product.category }}</p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Price</p>
                <p class="text-dark fw-bold">{{ props.product.price }}</p>
              </div>
              <div class="col-md-3 mb-1">
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

            <!-- Description Section -->
            <div class="row">
              <div class="col-12">
                <div
                  class="card bg-light p-2"
                  :class="
                    props.product.status === 'Available'
                      ? 'border-success'
                      : 'border-danger'
                  "
                >
                  <p class="mb-1 text-muted small">Description</p>
                  <p class="text-dark mb-0">
                    {{ props.product.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
