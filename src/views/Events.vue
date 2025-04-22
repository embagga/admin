<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader class="flex justify-between items-center">
          <div>
            <span> View <strong>Events List</strong> </span>
          </div>
          <div>
            <CForm class="flex justify-between">
              <CInputGroup>
                <CFormInput
                  v-model="form.search"
                  placeholder="Search by event id"
                  style="width: 300px"
                />
              </CInputGroup>
              <CButton
                color="secondary"
                @click="handleClickSearch"
                style="height: 36px; margin-left: 10px"
                type="button"
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
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">EVENT</CTableHeaderCell>
                <CTableHeaderCell scope="col">ADDED BY</CTableHeaderCell>
                <CTableHeaderCell scope="col">TYPE</CTableHeaderCell>
                <CTableHeaderCell scope="col">SUBSCRIPTION</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(event, index) in displayedData" :key="index">
                <CTableDataCell>{{ event.id }}</CTableDataCell>
                <CTableDataCell>{{ event.name }}</CTableDataCell>
                <CTableDataCell>{{ event.user.name }}</CTableDataCell>
                <CTableDataCell>{{ event.event_type.name }}</CTableDataCell>
                <CTableDataCell>{{ event.has_paid_subscription.toString() === '1' ? "subscribed" : "none" }}</CTableDataCell>
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
const getWithdrawFormData = () => {
  return {
    event_id: 0,
    receivers_name: '',
    amount: 0,
    transaction_date: '',
    method: '',
    received_account_number: '',
    received_account_name: '',
    transaction_id: '',
    other_details: '',
  }
}
export default {
  name: 'System Logs',
  data: function () {
    return {
      allData: [],
      displayedData: [],
      form: getFormData(),
      showWithdrawModal: false,
      withdrawForm: getWithdrawFormData(),
      mode: 'add',
    }
  },
  methods: {
    loadData() {
      var vm = this
      var query = {
        events: {
          user: {},
          event_type: {},
          _desc: ['time_inserted'],
        },
        transactions: {
          _a: '_sum_amount...amount associated_event_id_if_needed',
          _gb: ['associated_event_id_if_needed'],
          _w: [
            [
              ['status', 'e', 'success'],
              'AND',
              ['context', 'e', 'contribution'],
            ],
          ],
        },
        withdraws: {
          _a: '_sum_amount...amount event_id',
          _gb: ['event_id'],
        },
      }

      //add token
      Bee.token = localStorage.getItem('token')
      Bee.get(query, false, vm)
        .then((res) => {
          // console.log('These are results:', res)
          const transactions = res.transactions
          const indexedTransactions = {}
          for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index]
            const eventId = parseInt(transaction.associated_event_id_if_needed)
            indexedTransactions[eventId] = transaction.amount
          }
          const withdraws = res.withdraws
          const indexedWithdraws = {}
          for (let index = 0; index < withdraws.length; index++) {
            const withdraw = withdraws[index]
            const eventId = parseInt(withdraw.event_id)
            indexedWithdraws[eventId] = withdraw.amount
          }
          const events = res.events.map((event) => {
            const eventId = parseInt(event.id)
            let total_received = 0
            if (
              Object.prototype.hasOwnProperty.call(indexedTransactions, eventId)
            ) {
              total_received = indexedTransactions[eventId]
            }
            let total_withdrawn = 0
            if (
              Object.prototype.hasOwnProperty.call(indexedWithdraws, eventId)
            ) {
              total_withdrawn = indexedWithdraws[eventId]
            }
            const received_balance = total_received - total_withdrawn
            event.total_received = total_received
            event.total_withdrawn = total_withdrawn
            event.received_balance = received_balance
            return event
          })

          vm.allData = events
          vm.displayedData = events
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    toDate(phpTime) {
      return Utils.phpTimeToJsDateString(phpTime, true)
    },
    handleClickSearch() {
      var vm = this
      console.log('form.search', vm.form.search)
      const searchTerm = vm.form.search.trim()
      if (searchTerm.length > 0) {
        const searchTerms = searchTerm.toLowerCase().split(' ')
        const filteredData = []
        for (let index = 0; index < vm.allData.length; index++) {
          const event = vm.allData[index]
          const eventName = event.name.toLowerCase()
          let score = 0
          // by id first
          if(event.id.toString() === searchTerm.toLowerCase()){
            score += 1;
          }
          for (let j = 0; j < searchTerms.length; j++) {
            const query = searchTerms[j]
            if (eventName.indexOf(query) >= 0) {
              score += 1
            }
          }
          if (score > 0) {
            filteredData.push({
              ...event,
              search_score: score,
            })
          }
        }

        vm.displayedData = filteredData
      }
    },
    handleClickWithdraw(row) {
      this.withdrawForm.event_id = row.id
      this.withdrawForm.receivers_name = row.user.name
      this.showWithdrawModal = true
    },
    handleClickDetails(row) {
      //   this.form.id = row.id
      //   this.form.name = row.name
      //   this.form.status = row.status
      //   this.form.description = row.description
      //   this.mode = 'edit'
      //   this.showModal = true
    },
    handleModalClose() {
      this.withdrawForm = getWithdrawFormData()
      this.showWithdrawModal = false
    },
    onHandleSubmit() {
      var thisVM = this
      var method = 'post'
      var formData = {
        withdraw: {
          user_id: 1,
          event_id: thisVM.withdrawForm.event_id,
          receivers_name: thisVM.withdrawForm.receivers_name,
          amount: thisVM.withdrawForm.amount,
          transaction_date: thisVM.withdrawForm.transaction_date,
          transaction_date_time: 10000,
          method: thisVM.withdrawForm.method,
          received_account_number: thisVM.withdrawForm.received_account_number,
          received_account_name: thisVM.withdrawForm.received_account_name,
          transaction_id: thisVM.withdrawForm.transaction_id,
          other_details: thisVM.withdrawForm.other_details,
        },
      }
      Bee.token = localStorage.getItem('token')
      Bee[method](formData, false, thisVM)
        .then((res) => {
          thisVM.showWithdrawModal = false
          thisVM.withdrawForm = getWithdrawFormData()
          thisVM.loadData()
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
  },
  mounted() {
    this.loadData()
  },
}
</script>