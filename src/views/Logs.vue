<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader class="flex justify-between items-center">
          <div>
            <span> View <strong>Audit Trails</strong> </span>
          </div>
          <div>
            <CForm class="flex justify-between">
              <CInputGroup>
                <CFormInput
                  v-model="form.search"
                  placeholder="Enter anything to search"
                  style="width: 300px"
                />
              </CInputGroup>
              <CButton
                color="secondary"
                @click="handleClickSearch"
                style="height: 36px; margin-left: 10px"
              >
                Submit
              </CButton>
            </CForm>
          </div>
        </CCardHeader>
        <CCardBody>
          <CTable small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">WHEN</CTableHeaderCell>
                <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
                <CTableHeaderCell scope="col">ACTIVITY</CTableHeaderCell>
                <CTableHeaderCell scope="col">DETAILS</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(trail, index) in data" :key="index">
                <CTableDataCell>{{
                  toDate(trail.time_inserted)
                }}</CTableDataCell>
                <CTableDataCell style="min-width: 100px">{{
                  trail.who
                }}</CTableDataCell>
                <CTableDataCell style="min-width: 200px">{{
                  trail.activity
                }}</CTableDataCell>
                <CTableDataCell style="max-width: 500px">{{
                  trail.description
                }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import Bee from '@/utils/Bee'
import Utils from '../utils/index'
const getFormData = () => {
  return {
    search: '',
    page: 1,
    pageSize: 30,
  }
}
export default {
  name: 'System Logs',
  data: function () {
    return {
      data: [],
      form: getFormData(),
    }
  },
  methods: {
    loadData() {
      var vm = this
      var data = {
        trails: {
          _a: 'id who activity role description time_inserted',
          _desc: ['time_inserted'],
          _pg:  vm.form.pageSize + '.' +  vm.form.page
        },
      }
      var search = vm.form.search.trim()
      if (search && search.length > 0) {
        data = {
          trails: {
            _a: 'id who activity role description time_inserted',
            _desc: ['time_inserted'],
            _w: [
              [
                [
                  ["who", "ilike", search],
                  "OR",
                  ["description", "ilike", search]
                ],
                "OR",
                ["activity", "ilike", search]
              ],
              "OR",
              ["role", "ilike", search]
            ],
            _pg:  vm.form.pageSize + '.' +  vm.form.page
          },
        }
      }
      //add token
      Bee.token = localStorage.getItem('token')
      console.log("data", data);
      Bee.get(data, false, vm)
        .then((res) => {
          vm.data = res.trails
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    toDate(phpTime) {
      return Utils.phpTimeToJsDateString(phpTime, true)
    },
    handleClickSearch() {
      this.loadData();
    },
  },
  mounted() {
    this.loadData()
  },
}
</script>