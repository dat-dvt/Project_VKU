const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



const main = $('.main')
const tabContainers = Array.from($$('.container'))
const sidebarItems = $$('.sidebar__nav-item')
const sidebarSubnav = $('.sidebar__subnav')
const subnavItems = Array.from($$('.sidebar__subnav-item'))
const expandSubnavBtn = $('.sidebar__item-icon.btn--expand-subnav')
const sidebarExpandBtn = $('.header__container-btn.btn--expand')


const app = {
    isShrinkSidebar: false,
    suvnavHeight: 0,
    currentTab: 0,
    currentSidebarWidth: 250,


    calSubnavHeight() {
        return Array.from(subnavItems).reduce((acc, subnavItem) => {
            return acc + subnavItem.offsetHeight
        }, 0)
    },

    handleEvents() {
        const _this = this



        function expandSubnav() {
            if (!_this.isShrinkSidebar) {
                sidebarSubnav.style.height = _this.calSubnavHeight() + 'px';
            }
        }

        function closeSubnav() {
            if (!_this.isShrinkSidebar) {
                sidebarSubnav.style.height = 0;
            }
        }


        // Handle when click on sub navigation
        sidebarSubnav.onclick = function (e) {
            e.stopPropagation()
            const subnavItem = e.target.closest('.sidebar__subnav-item')
            const activeItem = $('.sidebar__subnav-item.active')
            const activeTab = $('.container.active')

            activeItem && activeItem.classList.remove('active')
            activeTab.classList.remove('active')

            _this.currentTab = subnavItems.indexOf(subnavItem) + 1
            tabContainers[_this.currentTab].classList.add('active')

            if (subnavItem) {
                subnavItem.classList.toggle('active')
            }

            if (sidebarItems[1].classList.contains('active')) {
                sidebarItems[1].classList.remove('active')
            }

        }


        // Handle when click on sidebar navigation
        sidebarItems.forEach((sidebarItem, index) => {
            if (index === 0) {
                sidebarItem.onclick = function (e) {

                    this.classList.add('active')
                    sidebarSubnav.classList.toggle('expand')
                    expandSubnavBtn.classList.toggle('expand')

                    if (sidebarSubnav.classList.contains('expand')) {
                        expandSubnav()
                    } else {
                        closeSubnav()
                    }
                }
            }
            if (index === 1) {
                sidebarItem.onclick = function (e) {
                    const activeItem = $('.sidebar__nav-item.active')
                    const activeSubnavItem = $('.sidebar__subnav-item.active')
                    const activeTab = $('.container.active')


                    activeTab.classList.remove('active')
                    activeItem && activeItem.classList.remove('active')
                    activeSubnavItem && activeSubnavItem.classList.remove('active')

                    _this.currentTab = tabContainers.length - 1
                    tabContainers[_this.currentTab].classList.add('active')

                    this.classList.add('active')
                    sidebarSubnav.classList.remove('expand')
                    closeSubnav()
                    expandSubnavBtn.classList.remove('expand')
                }
            }
        })

        // Handle when resize window
        window.onresize = (e) => {
            if(window.innerWidth >= 740) {
                document.documentElement.style.setProperty('--sidebar-width', this.currentSidebarWidth + 'px')
            } else {
                document.documentElement.style.setProperty('--sidebar-width', 0)
            }
        }


        // Handle expand and shrink sidebar
        sidebarExpandBtn.onclick = (e) => {
            this.isShrinkSidebar = !this.isShrinkSidebar
            if (this.isShrinkSidebar === false) {
                this.currentSidebarWidth = 250
                document.documentElement.style.setProperty('--sidebar-width', this.currentSidebarWidth + 'px')
            } else {
                if(window.innerWidth >= 740) {
                    this.currentSidebarWidth = 50;
                    document.documentElement.style.setProperty('--sidebar-width', this.currentSidebarWidth + 'px')
                } else {
                    document.documentElement.style.setProperty('--sidebar-width', 0)
                }
                sidebarSubnav.style.removeProperty('height')
                sidebarSubnav.classList.remove('expand')
                expandSubnavBtn.classList.remove('expand')
                closeSubnav()
            }
            main.classList.toggle('has--shrink-sidebar', this.isShirnkSidebar)
        }

        sidebarItems[0].onmouseover = (e) => {
            document.documentElement.style.setProperty('--subnav-height', this.calSubnavHeight() + 'px')
        }
    },


    setUpInitial() {
        document.documentElement.style.setProperty('--subnav-height', this.calSubnavHeight() + 'px')
    },



    start() {
        // Set up initial value
        this.setUpInitial()

        // Listening / Handle DOM events
        this.handleEvents()
    }
}

app.start()

