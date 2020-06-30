export function fetchCategoriesBegin(state) {
  state.categories = []
  state.error = null
  state.isLoading = true

}

export function fetchCategoriesSuccess(state, {categories, paging}) {
  state.categories = categories
  state.error = null
  state.paging.page = paging.Page
  state.paging.rowsPerPage = paging.Size
  state.paging.rowsNumber = paging.Total
  state.isLoading = false
}

export function fetchCategoriesError(state, error) {
  state.error = error
  state.isLoading = false
}

export function saveCategoryBegin (state) {
  state.error = null
  state.isSaved = false
  state.category = {}
  state.isSaving = true
}

export function saveCategorySuccess (state, { category, isSaved }) {
  state.category = category
  state.categoryDetail.category = category
  state.isSaved = isSaved
  state.isSaving = false
}

export function saveCategoryError (state, error) {
  state.error = error
  state.isSaved = false
  state.isSaving = false
}
