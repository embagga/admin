<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader class="flex justify-between">
          <span> View <strong>Audit Trails</strong> </span>
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
                <CTableDataCell>{{ toDate(trail.time_inserted) }}</CTableDataCell>
                <CTableDataCell style="min-width: 100px">{{ trail.who }}</CTableDataCell>
                <CTableDataCell style="min-width: 200px" >{{ trail.activity }}</CTableDataCell>
                <CTableDataCell style="max-width: 500px">{{  trail.description }}</CTableDataCell>
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
import Utils from "../utils/index"

export default {
  name: 'System Logs',
  data: function () {
    return {
      data: [],
    }
  },
  methods: {
    loadData() {
      var vm = this
      var data = {
        trails: {
          _a: 'id who activity role description time_inserted',
          _desc: ['time_inserted'],
        },
      }
      //add token
      Bee.token = localStorage.getItem('token')
      Bee.get(data, false, vm)
        .then((res) => {
          vm.data = res.trails
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    toDate(phpTime){
        return Utils.phpTimeToJsDateString(phpTime, true);
    }
  },
  mounted() {
    this.loadData()
  },
}
</script>