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
                    Administration Reset Password
                  </h4>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon :content="cilPhone" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Phone Number"
                      autocomplete="phonenumber"
                      type="text"
                      v-model="form.phoneNumber"
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon :content="cilPin" />
                    </CInputGroupText>
                    <CFormInput placeholder="Code" v-model="form.code" />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="New Password"
                      v-model="form.password"
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      v-model="form.confirmPassword"
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
                        Reset Password
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-end">
                      <CLink href="#/"> Login </CLink>
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
import { cilPhone, cilPin } from '@coreui/icons'
import Bee from '@/utils/Bee'
export default {
  name: 'Login',
  data: function () {
    return {
      LogoImg: LogoImg,
      cilPhone,
      cilPin,
      form: {
        phoneNumber: '',
        code: '',
        password: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    onHandleSubmit() {
      //
      var vm = this
      var data = {
        _f_change: {
          email: vm.form.phoneNumber,
          app_name: 'kev_lyn_managment',
          code: vm.form.code,
          password: vm.form.password,
        },
      }
      console.log('change password data:', data)
      //remove token
      Bee.token = ''
      Bee.post(data, false, vm)
        .then((res) => {
          vm.$router.push('/')
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
  },
  mounted() {},
}
</script>
