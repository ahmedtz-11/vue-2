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
const categories = ref([]);
const statuses = ref(["Active", "Inactive"]);

// Define form fields with Vee-Validate
const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("Category name is required"),
    status: yup.string().required("Status is required"),
  }),
});

// Bind form fields to Vee-Validate
const { value: name, errorMessage: nameError } = useField("name");
const { value: status, errorMessage: statusError } = useField("status");

onMounted(async () => {
  categories.value = await productStore.fetchCategories();
  // Populate form if editing a product
  if (props.product) {
    resetForm({
      values: {
        name: props.product.name,
        status: props.product.status,
      },
    });
  }
});

// Handle form submission
const saveCategory = handleSubmit(async (values) => {
  const productData = {
    id: props.product?.id || null,
    name: values.name,
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
      class="modal fade show"
      id="categoryModal"
      tabindex="-1"
      aria-labelledby="categoryModalLabel"
      aria-hidden="true"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title" id="categoryModalLabel">
              {{ product ? "Edit Category" : "Add New Category" }}
            </h3>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body fs-5">
            <form @submit.prevent="saveProduct">
              <div class="row g-3">
                <!-- Category -->
                <div class="col-12 col-md-6">
                  <label for="name" class="form-label">
                    <i class="bi bi-tag me-2"></i>Category Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    v-model="name"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': nameError }"
                  />
                  <div v-if="nameError" class="invalid-feedback">
                    {{ nameError }}
                  </div>
                </div>
                <!-- Status -->
                <div class="col-12 col-md-6">
                  <label for="status" class="form-label">
                    <i class="bi bi-info-square me-2"></i>Status
                  </label>
                  <select
                    id="status"
                    v-model="status"
                    class="form-select form-select-lg"
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
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="submit" class="btn btn-success" @click="saveCategory">
              <i class="bi bi-save me-2"></i>
              {{ product ? "Save Changes" : "Add Category" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
