import { action, observable, computed } from 'mobx'

class PulldownMenuState {

  @observable headerExpanded = false

  @observable selectedLocation = 'New York'

  @observable selectedDate = 'March 24th'

  @observable selectedGroup = '2 Guests'

  @computed get topMenuData() {
    return [
      { key: 'location', title: this.selectedLocation },
      { key: 'date', title: this.selectedDate },
      { key: 'group', title: this.selectedGroup },
    ]
  }

  @computed get topMenuTitle() {
    return `${this.selectedLocation} • ${this.selectedDate} • ${this.selectedGroup}`
  }

  @action setHeaderExpanded(value) {
    this.headerExpanded = value
  }
}

export default new PulldownMenuState()
