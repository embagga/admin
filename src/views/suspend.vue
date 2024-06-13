<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody v-if="isSuccess == false">
                <CForm class="text-center">
                  <img class="w-25" :src="LogoImg" alt="logo" />
                  <h4 class="text-medium-emphasis mb-5">Suspend Your Embagga Account</h4>
                  <h6 class="text-small mb-5" style="color: red">To resume your account, you will need to first contact customer support</h6>
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
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="form.password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6" class="text-start">
                      <CButton
                        type="button"
                        @click.prevent="onHandleSubmit"
                        color="danger"
                        class="px-4 text-white"
                      >
                        Suspend
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-end">
                      <CLink href="#/remove"> Delete Account & Data</CLink>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol :xs="12" class="text-start" style="color: red; padding-top: 10px;">
                      {{error}}
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>

              <CCardBody v-if="isSuccess == true">
                <CForm class="text-center">
                  <img class="w-25" :src="LogoImg" alt="logo" />
                  <h4 class="text-medium-emphasis mb-5">Suspend Your Embagga Account</h4>
                  <h6 class="text-small mb-5" style="color: green">{{form.phoneNumber}} Has been suspended successfully</h6>
                  <CRow>
                    <CCol :xs="6" class="text-start">
                      <CButton
                        type="button"
                        @click.prevent="isSuccess = false; form.phoneNumber = '';"
                        color="danger"
                        class="px-4 text-white"
                      >
                        Ok
                      </CButton>
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
  name: 'Suspend',
  data: function () {
    return {
      LogoImg: LogoImg,
      cilPhone,
      form: {
        phoneNumber: '',
        password: '',
      },
      error: "",
      isSuccess: false
    }
  },
  methods: {
    onHandleSubmit() {
      //
      var vm = this
      vm.error = "";
      var data = {
        _f_suspend: {
          email: vm.form.phoneNumber,
          password: vm.form.password,
        },
      }
      //remove token
      Bee.token = ''
      Bee.post(data, false, vm)
        .then((res) => {
          console.log(res);
          if(res._f_suspend && res._f_suspend == "ok"){
            vm.isSuccess = true;
            vm.form.password = "";
          }
        })
        .catch((errors) => {
          vm.error = Array.isArray(errors)?errors[0]:errors;
          console.log('Errors', errors)
        })
    },
  },
  mounted() {},
}
</script>
