import { httpClient } from 'src/api/http';

export async function loadCategories({ commit, dispatch }, { filter, page, size }) {
  commit('fetchCategoriesBegin');

  try {
    const queryParams = new URLSearchParams({
      ...filter,
      page: page,
      size: size
    }).toString()
    const response = await httpClient.get(`/categories?${queryParams}`)

    commit('fetchCategoriesSuccess', {
      categories: response.Data,
      paging: response.Paging
    })

    if(response.categories && response.stations.length > 0) {
      return response.categories
    } else {
      return null
    }
  } catch (error) {
    commit('fetchCategoriesError', error)
    return null
  }
}

export async function saveCategory({ commit }, { category }) {
  commit('saveCategoryBegin')

  const data = {
    name: category.name
  }

  try {
    if (category.Id) {
      category = await httpClient.put(`/categories/${category.Id}`, data)
    } else {
      category = await httpClient.post(
        '/categories',
        data
      )
    }

    commit('saveCategorySuccess', {
      category: { ...category },
      isSaved: true
    })
  } catch (error) {
    commit('saveCategoryError', error)
  }
}
