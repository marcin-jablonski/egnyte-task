class DataStorage {
  constructor(initialData) {
    this.state = initialData;
  }

  update(data) {
    this.state = {
      ...this.state,
      ...data
    }
  }
}

export default DataStorage;