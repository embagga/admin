<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader class="flex justify-between">
          <span> Manage <strong>System Users</strong> </span>
          <CButton
            color="primary"
            class="float-right"
            size="sm"
            @click.prevent="handleClickAdd()"
          >
            Add Admin
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
                <CTableHeaderCell scope="col">CONTACT</CTableHeaderCell>
                <CTableHeaderCell scope="col">ROLE</CTableHeaderCell>
                <CTableHeaderCell scope="col">STATUS</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(user, index) in data" :key="index">
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>{{ user.name }}</CTableDataCell>
                <CTableDataCell>{{ user.email }}</CTableDataCell>
                <CTableDataCell>{{ getRole(user) }}</CTableDataCell>
                <CTableDataCell>{{ user.status }}</CTableDataCell>
                <CTableDataCell width="200 text-end">
                  <CButton
                    color="warning"
                    size="sm"
                    class="mr-2"
                    :disabled="getRole(user) == 'super role'"
                    @click.prevent="handleClickEdit(user)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    :disabled="getRole(user) != 'admin'"
                    @click.prevent="handleClickDelete(user)"
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>

    <CModal :visible="showModal" @close="handleModalClose">
      <CModalHeader dismiss @close="handleModalClose" class="flex">
        <CModalTitle>
          {{ mode === 'add' ? 'Add' : 'Edit' }} System User
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm class="text-center">
          <CInputGroup class="mb-3">
            <CInputGroupText style="min-width: 100px"> Name: </CInputGroupText>
            <CFormInput v-model="form.name" />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText style="min-width: 100px">
              Contact:
            </CInputGroupText>
            <CFormInput v-model="form.email" />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText style="min-width: 100px">Status: </CInputGroupText>
            <CFormSelect
              v-model="form.status"
              :options="[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Disabled' },
                { value: 'pending', label: 'Pending' },
              ]"
            />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText style="min-width: 100px"> Role: </CInputGroupText>
            <CFormInput :disabled="true" v-model="form.role" />
          </CInputGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="handleModalClose"> Close </CButton>
        <CButton color="primary" @click="onHandleSubmit">{{
          mode === 'add' ? 'Submit' : 'Save Changes'
        }}</CButton>
      </CModalFooter>
    </CModal>
  </CRow>
</template>

<script>
import Bee from '@/utils/Bee'
const getFormData = () => {
  return {
    name: '',
    email: '',
    status: 'enabled',
    id: 0,
    role: '',
  }
}
export default {
  name: 'System Users',
  data: function () {
    return {
      data: [],
      showModal: false,
      form: getFormData(),
      mode: 'add',
    }
  },
  methods: {
    getRole(user) {
      if (user.user_roles && user.user_roles.length > 0) {
        const role = user.user_roles[0].role
        if (role.name === 'general' && user.events.length > 0) {
          return 'owner'
        } else if (role.name === 'general') {
          return 'guest'
        }
        return role.name
      }
      return 'Unknown'
    },
    loadData() {
      var vm = this
      var data = {
        users: {
          events: {},
          user_roles: {
            role: {},
          },
        },
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.get(data, false, vm)
        .then((res) => {
          vm.data = res.users
          vm.handleModalClose()
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    handleClickEdit(row) {
      this.form.id = row.id
      this.form.name = row.name
      this.form.status = row.status
      this.form.email = row.email
      this.form.role = this.getRole(row)
      this.mode = 'edit'
      this.showModal = true
    },
    handleClickDelete(row) {
      var vm = this
      var data = {
        user: {
          _w: [['id', 'e', row.id]],
        },
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.delete(data, false, vm)
        .then((res) => {
          vm.loadData()
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    handleModalClose() {
      this.form = getFormData()
      this.showModal = false
    },
    onHandleSubmit() {
      var thisVM = this
      var method = 'post'
      var data = {
        user: {
          name: thisVM.form.name,
          status: thisVM.form.status,
          email: thisVM.form.email,
        },
      }
      var rnd = Math.floor(Math.random() * (max - min + 1) + min)
      var password = 'Psw-' + rnd
      if (thisVM.mode === 'edit') {
        data.user._w = [['id', 'e', thisVM.form.id]]
        method = 'update'
        Bee.token = localStorage.getItem('token')
      } else {
        var min = 1000
        var max = 9999

        var data = {
          _f_signup: {
            user: {
              email: thisVM.form.email,
              password: password,
              name: thisVM.form.name,
              country_id: 'uganda',
            },
            as: 'admin',
            _signup_as_active: true,
          },
        }
        Bee.token = ''
      }
      Bee[method](data, false, thisVM)
        .then((res) => {
          Bee.token = localStorage.getItem('token')
          thisVM.loadData()
          if (thisVM.mode != 'edit') {
            var sms = `Hello ${thisVM.form.name}, your embagga admin credentials are: `
            sms = `${sms}. Username is ${thisVM.form.email}, password is ${password}`
            var msg = {
              _f_mail: {
                sms: {
                  phone_number: thisVM.form.email,
                  message: sms,
                },
              },
            }
            Bee.post(msg, false, thisVM)
          }
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    handleClickAdd() {
      this.mode = 'add'
      this.form = getFormData()
      this.showModal = true
    },
  },
  mounted() {
    this.loadData()
  },
}
</script>