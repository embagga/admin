<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <CCardGroup>
            <CCard class="shadow-lg rounded-4 p-4">
              <div class="text-center p-4">
                <img class="w-25" :src="LogoImg" alt="logo" />
              </div>
              <div
                id="pesapal-mobile-transaction-completed"
                class="text-center"
              >
                <CIcon
                  name="cil-check-circle"
                  size="xxl"
                  class="text-success mb-4"
                />
                <h3 class="text-success mb-3">Thank You!</h3>
                <p class="lead mb-4 text-muted">
                  Your transaction was successfully completed.
                </p>
                <p class="text-muted">
                  You can now close this window and return to the Embagga App.
                </p>
              </div>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<style scoped>
.bg-light {
  background-color: #f8f9fa;
}

#pesapal-mobile-transaction-completed {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #495057;
  animation: fadeIn 1s ease-out;
}

.text-success {
  color: #28a745 !important;
}

.lead {
  font-size: 1.25rem;
}

.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded-4 {
  border-radius: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script>
import LogoImg from '@/assets/images/logo.jpg'
export default {
  name: 'PesaPal Transaction Completed',
  data: function () {
    return {
      LogoImg: LogoImg,
    }
  },
  mounted() {},
}
</script>

