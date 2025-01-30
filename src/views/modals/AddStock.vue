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

// Define form fields with correct validation rules
const { handleSubmit } = useForm({
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
      .min(50, "Price must be at least 50"),
    status: yup.string().required("Status is required"),
  }),
});

// Bind form fields to Vee-Validate
const { value: product, errorMessage: productError } = useField("product");
const { value: quantity, errorMessage: quantityError } = useField("quantity");
const { value: purchasingPrice, errorMessage: priceError } = useField("purchasingPrice");
const { value: expiryDate, errorMessage: expiryError } = useField("expiryDate");

const addStock = handleSubmit(async (values) => {
  const stockData = {
    product_name: product.value,
    quantity: quantity.value,
    purchasing_price: purchasingPrice.value,
    expiry_date: expiryDate.value,
    added_by: userStore.username,
  };

  const success = await stockStore.addStock(stockData);
  if (success) {
    emit("close");
    stockStore.fetchStocks();
  }
});

const closeModal = () => {
  emit("close");
};

onMounted(async () => {
  await productStore.fetchProducts();
  await userStore.fetchLoggedInUser();
});
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show d-flex align-items-center justify-content-center fs-5"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div
        class="card p-4 w-50 w-md-75 w-lg-50 shadow-lg rounded-3 overflow-auto"
      >
        <div class="d-flex justify-content-between mb-3">
          <h3><i class="bi bi-cart-plus me-2"></i>Add New Stock</h3>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="addStock">
          <!-- Product -->
          <div class="mb-3">
            <label for="product" class="form-label">
              <i class="bi bi-box-seam me-2"></i>Product
            </label>
            <select
              id="product"
              class="form-select"
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

          <!-- Quantity -->
          <div class="mb-3">
            <label for="quantity" class="form-label">
              <i class="bi bi-bag-plus me-2"></i>Quantity
            </label>
            <input
              type="number"
              id="quantity"
              class="form-control"
              :class="{ 'is-invalid': quantityError }"
              v-model="quantity"
              min="1"
            />
            <div v-if="quantityError" class="invalid-feedback">
              {{ quantityError }}
            </div>
          </div>

          <!-- Purchasing Price -->
          <div class="mb-3">
            <label for="purchasingPrice" class="form-label">
              <i class="bi bi-cash-stack me-2"></i>Purchasing Price
            </label>
            <input
              type="number"
              id="purchasingPrice"
              class="form-control"
              :class="{ 'is-invalid': priceError }"
              v-model="purchasingPrice"
              min="0"
            />
            <div v-if="priceError" class="invalid-feedback">
              {{ priceError }}
            </div>
          </div>

          <!-- Expiry Date -->
          <div class="mb-3">
            <label for="expiryDate" class="form-label">
              <i class="bi bi-calendar-minus me-2"></i>Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              class="form-control"
              v-model="expiryDate"
              :class="{ 'is-invalid': expiryError }"
            />
            <div v-if="expiryError" class="invalid-feedback">
              {{ expiryError }}
            </div>
          </div>

          <!-- Added By -->
          <div class="mb-3">
            <label for="addedBy" class="form-label">
              <i class="bi bi-person me-2"></i>Added By
            </label>
            <input
              type="text"
              id="addedBy"
              class="form-control"
              :value="userStore.username"
              disabled
            />
          </div>

          <!-- Buttons -->
          <button type="submit" class="btn btn-success w-50">
            <i class="bi-save me-2"></i> Add Stock
          </button>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal {
    font-family: "Nunito Sans", serif;
}
</style>
