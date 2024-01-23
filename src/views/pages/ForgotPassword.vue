<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm class="text-center">
                  <img class="w-25" :src="LogoImg" alt="logo" />
                  <h4 class="text-medium-emphasis mb-5">
                    Administration Forgot Password
                  </h4>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon :content="cilPhone" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Phone Number"
                      autocomplete="phonenumber"
                      type="tel"
                      v-model="form.phoneNumber"
                    />
                  </CInputGroup>
        
                  <CRow>
                    <CCol :xs="6" class="text-start">
                      <CButton
                        type="button"
                        @click.prevent="onHandleSubmit"
                        color="primary"
                        class="px-4"
                      >
                        Get Reset Code
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-end">
                      <CLink href="#/" >
                        Login
                      </CLink>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import LogoImg from '@/assets/images/logo.jpg'
import { cilPhone } from '@coreui/icons'
import Bee from '@/utils/Bee'
export default {
  name: 'Login',
  data: function () {
    return {
      LogoImg: LogoImg,
      cilPhone,
      form: {
        phoneNumber: ''
      },
    }
  },
  methods: {
    onHandleSubmit() {
      //
      var vm = this
      var data = {
        _f_forgot: {
          email: vm.form.phoneNumber
        },
      }
      console.log('data:', data)
      //remove token
      Bee.token = ''
      Bee.post(data, false, vm)
        .then((res) => {
          vm.$router.push('/reset')
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
  },
  mounted() {},
}
</script>
