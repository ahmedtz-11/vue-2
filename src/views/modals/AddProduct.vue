<script setup>
import { ref, onMounted } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useProductStore } from "@/stores/product";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["close"]);

const productStore = useProductStore();

// Define form fields with Vee-Validate
const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("Product name is required"),
    description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
    price: yup
      .number()
      .required("Price is required")
      .min(50, "Price must be at least 50"),
    status: yup.string().required("Status is required"),
  }),
});

// Bind form fields to Vee-Validate
const { value: name, errorMessage: nameError } = useField("name");
const { value: description, errorMessage: descriptionError } =
  useField("description");
const { value: category, errorMessage: categoryError } = useField("category");
const { value: price, errorMessage: priceError } = useField("price");
const { value: status, errorMessage: statusError } = useField("status");

const categories = ref([]);
const statuses = ref(["Available", "Not Available"]);

onMounted(async () => {
  categories.value = await productStore.fetchCategories();

  // Populate form if editing a product
  if (props.product) {
    resetForm({
      values: {
        name: props.product.name,
        description: props.product.description,
        category: props.product.category,
        price: props.product.price,
        status: props.product.status,
      },
    });
  }
});

// Handle form submission
const saveProduct = handleSubmit(async (values) => {
  const productData = {
    id: props.product?.id || null,
    name: values.name,
    category: values.category,
    price: values.price,
    description: values.description,
    status: values.status,
  };

  await productStore.saveProduct(productData);
  emit("close"); // Notify parent to close the modal
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
      <div class="card p-4 w-50">
        <div class="d-flex justify-content-between mb-2">
          <h3>
            <i class="bi bi-pencil-square me-2"></i>
            {{ product ? "Edit Product" : "Add New Product" }}
          </h3>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="saveProduct">
          <!-- Product Name -->
          <div class="mb-3">
            <label for="name" class="form-label">
              <i class="bi bi-box-seam me-2"></i>Product Name
            </label>
            <input
              type="text"
              id="name"
              v-model="name"
              class="form-control"
              :class="{ 'is-invalid': nameError }"
            />
            <div v-if="nameError" class="invalid-feedback">
              {{ nameError }}
            </div>
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label for="description" class="form-label">
              <i class="bi bi-card-text me-2"></i>Description
            </label>
            <textarea
              id="description"
              v-model="description"
              class="form-control"
              rows="1"
              :class="{ 'is-invalid': descriptionError }"
            ></textarea>
            <div v-if="descriptionError" class="invalid-feedback">
              {{ descriptionError }}
            </div>
          </div>

          <!-- Category -->
          <div class="mb-3">
            <label for="category" class="form-label">
              <i class="bi bi-tags me-2"></i>Category
            </label>
            <select
              id="category"
              v-model="category"
              class="form-select"
              :class="{ 'is-invalid': categoryError }"
            >
              <option value="" disabled>Select a category</option>
              <option
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.category"
              >
                {{ cat.category }}
              </option>
            </select>
            <div v-if="categoryError" class="invalid-feedback">
              {{ categoryError }}
            </div>
          </div>

          <!-- Price -->
          <div class="mb-3">
            <label for="price" class="form-label">
              <i class="bi bi-cash-coin me-2"></i>Price
            </label>
            <input
              type="number"
              id="price"
              v-model="price"
              class="form-control"
              :class="{ 'is-invalid': priceError }"
              min="50"
            />
            <div v-if="priceError" class="invalid-feedback">
              {{ priceError }}
            </div>
          </div>

          <!-- Status -->
          <div class="mb-3">
            <label for="status" class="form-label">
              <i class="bi bi-info-square me-2"></i>Status
            </label>
            <select
              id="status"
              v-model="status"
              class="form-select"
              :class="{ 'is-invalid': statusError }"
            >
              <option value="" disabled>Select a status</option>
              <option v-for="stat in statuses" :key="stat" :value="stat">
                {{ stat }}
              </option>
            </select>
            <div v-if="statusError" class="invalid-feedback">
              {{ statusError }}
            </div>
          </div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success w-50">
              <i class="bi bi-save me-2"></i>
              {{ product ? "Save Changes" : "Add Product" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style>
.modal {
    font-family: "Nunito Sans", serif;
}
/* <!-- <button type="button" class="btn btn-danger" @click="closeModal">
              <i class="bi bi-x-lg me-2"></i>
              Cancel
            </button> --> */

/* $modal-backdrop-bg-color: rgba(0, 0, 0, 0.1);
$modal-backdrop-z-index: 1050;

.modal-backdrop {
  position: fixed;
  inset: 0; // shorthand for top, right, bottom, left
  background-color: $modal-backdrop-bg-color;
  z-index: $modal-backdrop-z-index;
} */
</style>
