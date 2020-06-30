export function fetchStationsBegin(state) {
  state.stations = []
  state.error = null
  state.isLoading = true

}

export function fetchStationSuccess(state, {stations, paging}) {
  state.stations = stations
  state.error = null
  state.paging.page = paging.Page
  state.paging.rowsPerPage = paging.Size
  state.paging.rowsNumber = paging.Total
  state.isLoading = false
}

export function fetchStationsError(state, error) {
  state.error = error
  state.isLoading = false
}
