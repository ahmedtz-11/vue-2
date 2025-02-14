<script setup>
import { onMounted } from "vue";
import { useSalesStore } from "@/stores/sales";

const props = defineProps({
  transaction: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);
const salesStore = useSalesStore();

onMounted(async () => {
  salesStore.fetchTransactions();
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
              Transaction ID:
              <span class="fw-bold">{{
                props.transaction.transaction_id
              }}</span>
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
              <!-- Statuses etc. -->
              <div class="col-md-6 mb-1">
                <p class="mb-1 text-muted small">Transaction made at:</p>
                <p class="text-dark fw-bold">
                  {{ props.transaction.transaction_date }}
                </p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Payment Method:</p>
                <p>
                  <span
                    class="badge"
                    :class="{
                      'bg-primary': transaction.payment_method === 'Cash',
                      'bg-secondary': transaction.payment_method === 'Credit',
                      'bg-info': transaction.payment_method === 'Online',
                    }"
                  >
                    {{ transaction.payment_method }}
                  </span>
                </p>
              </div>
              <div class="col-md-3 mb-1">
                <p class="mb-1 text-muted small">Payment Status:</p>
                <p>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': transaction.payment_status === 'Paid',
                      'bg-warning': transaction.payment_status === 'Pending',
                      'bg-danger': transaction.payment_status === 'Cancelled',
                    }"
                  >
                    {{ transaction.payment_status }}
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-1">
                <p class="mb-1 text-muted small">Total Amount:</p>
                <p class="text-dark fw-bold">
                  {{ $formatMoney(props.transaction.total_amount) }}
                </p>
              </div>
              <div class="col-md-6 mb-1">
                <p class="mb-1 text-muted small">Sold By:</p>
                <p class="text-dark fw-bold text-capitalize fs-5">
                  {{ props.transaction.sold_by }}
                </p>
              </div>
            </div>

            <!-- Description Section -->
            <div class="row">
              <div class="col-12">
                <div class="card bg-light p-2">
                  <p class="mb-1 text-muted">Details:</p>
                  <table class="table table-striped text-capitalize fs-6">
                    <thead class="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Qty.</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in props.transaction.details || []"
                        :key="item.product_id"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.product_name }}</td>
                        <td>{{ $formatMoney(item.unit_price) }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ $formatMoney(item.total_price) }}</td>
                      </tr>
                      <tr class="fs-5">
                        <td colspan="4" class="fw-bold text-success">Total</td>
                        <td class="fw-bold text-success">
                          {{ $formatMoney(props.transaction.total_amount) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
