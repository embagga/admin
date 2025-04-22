<template>
  <CRow>
    <CCol :xs="12">
      <CRow>
        <CCol :xs="12">
          <CCard class="mb-4">
            <CCardHeader class="flex justify-between items-center">
              <div>
                <strong>Events Details</strong>
              </div>
              <div></div>
            </CCardHeader>
            <CCardBody v-if="event !== null">

              <CRow>
                <CCol :xs="2">
                  Name:
                </CCol>
                <CCol :xs="2">
                  <b>{{event.name}}</b>
                </CCol>
                <CCol :xs="1">
                  Type:
                </CCol>
                <CCol :xs="1">
                  <b>{{event.event_type.name}}</b>
                </CCol>
                <CCol :xs="3">
                </CCol>
                <CCol :xs="1">
                  Start Date:
                </CCol>
                <CCol :xs="2">
                  <b>{{formatDate(event.start_date)}}</b>
                </CCol>
                
              </CRow>

              <CRow>
                <CCol :xs="2">
                  Description:
                </CCol>
                <CCol :xs="10">
                  <b>{{event.name}}</b>
                </CCol>
              </CRow>

              <CRow>
                <CCol :xs="2">
                  Balance:
                </CCol>
                <CCol :xs="7">
                  <b>{{comma(balance)}}</b>
                </CCol>
                <CCol :xs="1">
                  End Date:
                </CCol>
                <CCol :xs="2">
                  <b>{{formatDate(event.end_date)}}</b>
                </CCol>
              </CRow>


              
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol :xs="12">
          <CCard class="mb-4">
            <CCardHeader class="flex justify-between items-center">
              <div>
                <strong>Events Statement</strong>
              </div>
              <div></div>
            </CCardHeader>
            <CCardBody>
              <CTable small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">WHO</CTableHeaderCell>
                    <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TYPE</CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style="max-width: 100px; text-align: right"
                      >AMOUNT</CTableHeaderCell
                    >
                    <CTableHeaderCell
                      scope="col"
                      style="max-width: 100px; text-align: right"
                      >BALANCE</CTableHeaderCell
                    >
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow
                    v-for="(balanceEntry, index) in displayedData"
                    :key="index"
                  >
                    <CTableDataCell>{{
                      formatDate(
                        balanceEntry.type == 'withdrawal'
                          ? balanceEntry.transaction_date
                          : balanceEntry.transaction_start_date,
                      )
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      balanceEntry.type == 'withdrawal'
                        ? balanceEntry.received_account_name
                        : balanceEntry.source_account_name
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      balanceEntry.type == 'withdrawal'
                        ? balanceEntry.transaction_id
                        : balanceEntry.embagga_gen_transaction_id
                    }}</CTableDataCell>
                    <CTableDataCell>{{ balanceEntry.type }}</CTableDataCell>

                    <CTableDataCell
                      style="max-width: 100px; text-align: right"
                      >{{ comma(balanceEntry.amount) }}</CTableDataCell
                    >

                    <CTableDataCell style="max-width: 100px; text-align: right"
                      ><b>{{ comma(balanceEntry.balance) }}</b></CTableDataCell
                    >
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CCol>
  </CRow>
</template>

<script>
import Bee from '@/utils/Bee'
import Utils from '../utils/index'

function createBalanceStatement(contributions, withdrawals) {
  // Normalize data format
  const transactions = [
    ...contributions.map((c) => ({
      ...c,
      date: c.transaction_start_date,
      amount: parseFloat(c.amount),
      type: 'contribution',
    })),
    ...withdrawals.map((w) => ({
      ...w,
      date: w.transaction_date,
      amount: -1 * parseFloat(w.amount), // Negative amount for withdrawals
      type: 'withdrawal',
    })),
  ]

  // Sort by date (oldest first)
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date))

  // Calculate running balance
  let balance = 0
  const statement = transactions.map((transaction) => {
    balance += transaction.amount
    return {
      ...transaction,
      date: transaction.date,
      type: transaction.type,
      amount: Math.abs(transaction.amount), // Display absolute value
      balance: balance,
    }
  })

  return { statement, balance }
}

export default {
  name: 'System Logs',
  data: function () {
    return {
      displayedData: [],
      balance: 0,
      event: null,
      showWithdraws: false,
      showContributions: true,
      eventId: 0,
    }
  },
  methods: {
    loadData(eventId) {
      var vm = this
      var query = {
        event: {
          user: {},
          event_type: {},
          _w: [['id', 'e', eventId]],
        },
        transactions: {
          _w: [
            [
              [
                ['associated_event_id_if_needed', 'e', eventId],
                'AND',
                ['context', 'e', 'contribution'],
              ],
              'AND',
              ['status', 'e', 'success'],
            ],
          ],
        },
        withdraws: {
          _w: [['event_id', 'e', eventId]],
        },
      }

      //add token
      Bee.token = localStorage.getItem('token')
      Bee.get(query, false, vm)
        .then((res) => {
          // console.log('These are results:', res)

          const bStatement = createBalanceStatement(
            res.transactions,
            res.withdraws,
          )

          vm.displayedData = bStatement.statement
          vm.balance = bStatement.balance
          vm.event = res.event
        })
        .catch((errors) => {
          console.log('Errors', errors)
        })
    },
    formatDate(value) {
      return Utils.formatDate(value)
    },
    comma(value) {
      return Utils.comma(value)
    },
  },
  mounted() {
    this.eventId = this.$route.params.id
    this.loadData(this.eventId)
  },
}
</script>