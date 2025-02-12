<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "/home/ahmed/Documents/vue-projects/vue-2/src/stores/product.js";
import { useUserStore } from "/home/ahmed/Documents/vue-projects/vue-2/src/stores/user.js";
import { useStockStore } from "/home/ahmed/Documents/vue-projects/vue-2/src/stores/stock.js";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  stock: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["close"]);

const productStore = useProductStore();
const userStore = useUserStore();
const stockStore = useStockStore();
const isEditing = ref(false);

// Define form fields with correct validation rules
const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    product: yup.string().required("Product is required"),
    quantity: yup
      .number()
      .typeError("Quantity must be a number")
      .required("Quantity is required")
      .positive("Quantity must be greater than zero"),
    expiryDate: yup
      .date()
      .typeError("Expiry date must be a valid date")
      .required("Expiry date is required")
      .min(new Date(), "Expiry date cannot be in the past"),
    purchasingPrice: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(50, "Price must be at least 50")
  }),
});

// Bind form fields to Vee-Validate
const { value: product, errorMessage: productError } = useField("product");
const { value: quantity, errorMessage: quantityError } = useField("quantity");
const { value: purchasingPrice, errorMessage: priceError } =
  useField("purchasingPrice");
const { value: expiryDate, errorMessage: expiryError } = useField("expiryDate");

const populateForm = () => {
  if (props.stock) {
    product.value = props.stock.product_name;
    quantity.value = props.stock.quantity;
    purchasingPrice.value = props.stock.purchasing_price;
    expiryDate.value = props.stock.expiry_date;
    isEditing.value = true;
  } else {
    resetForm();
  }
};

// Handle form submission
const addNewStock = handleSubmit(async (values) => {
  const stockData = {
    id: props.stock?.id || null,
    product_name: values.product,
    quantity: values.quantity,
    purchasing_price: values.purchasingPrice,
    expiry_date: values.expiryDate,
    added_by: userStore.username,
  };
  try {
    await stockStore.addStock(stockData, isEditing.value);
    resetForm();
    emit("close");
  } catch (error) {
    console.error("Error saving stock:", error);
  }
});

const closeModal = () => {
  emit("close");
};

onMounted(async () => {
  productStore.fetchProducts();
  userStore.fetchLoggedInUser();
  populateForm();
});
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show"
      id="stockModal"
      tabindex="-1"
      aria-labelledby="stockModalLabel"
      aria-hidden="true"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title" id="stockModalLabel">
              {{ stock ? "Edit Stock" : "Add New Stock" }}
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
            <form @submit.prevent="addNewStock">
              <!-- Product -->
              <div class="mb-3">
                <label for="product" class="form-label">
                  <i class="bi bi-box-seam me-2"></i>Product
                </label>
                <select
                  id="product"
                  class="form-select form-select-lg"
                  :class="{ 'is-invalid': productError }"
                  v-model="product"
                >
                  <option value="" disabled>Select a product</option>
                  <option
                    v-for="prod in productStore.products"
                    :key="prod.id"
                    :value="prod.name"
                    class="text-capitalize"
                  >
                    {{ prod.name }}
                  </option>
                </select>
                <div v-if="productError" class="invalid-feedback">
                  {{ productError }}
                </div>
              </div>

              <div class="row mb-3 g-3">
                <!-- Quantity -->
                <div class="col-12 col-md-6">
                  <label for="quantity" class="form-label">
                    <i class="bi bi-bag-plus me-2"></i>Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': quantityError }"
                    v-model="quantity"
                    min="1"
                  />
                  <div v-if="quantityError" class="invalid-feedback">
                    {{ quantityError }}
                  </div>
                </div>
                <!-- Purchasing Price -->
                <div class="col-12 col-md-6">
                  <label for="purchasingPrice" class="form-label">
                    <i class="bi bi-cash-stack me-2"></i>Purchasing Price
                  </label>
                  <input
                    type="number"
                    id="purchasingPrice"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': priceError }"
                    v-model="purchasingPrice"
                    min="0"
                  />
                  <div v-if="priceError" class="invalid-feedback">
                    {{ priceError }}
                  </div>
                </div>
              </div>

              <div class="row mb-3 g-3">
                <!-- Expiry Date -->
                <div class="col-12 col-md-6">
                  <label for="expiryDate" class="form-label">
                    <i class="bi bi-calendar-minus me-2"></i>Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    class="form-control form-control-lg"
                    v-model="expiryDate"
                    :class="{ 'is-invalid': expiryError }"
                  />
                  <div v-if="expiryError" class="invalid-feedback">
                    {{ expiryError }}
                  </div>
                </div>
                <!-- Added By -->
                <div class="col-12 col-md-6">
                  <label for="addedBy" class="form-label">
                    <i class="bi bi-person me-2"></i>Added By
                  </label>
                  <input
                    type="text"
                    id="addedBy"
                    class="form-control form-control-lg"
                    :value="userStore.username"
                    disabled
                  />
                </div>
              </div>

              <!-- Button -->
              <div class="text-end">
                <button type="submit" class="btn btn-success" @click="addNewStock">
                  <i class="bi-save me-2"></i>
                  {{ stock ? "Save Changes" : "Add Stock" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
