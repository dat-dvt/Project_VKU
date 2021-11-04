const VKU_STORAGE_KEY = 'VKU'


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



const main = $('.main')
const tabContainers = Array.from($$('.container'))
const sidebarItems = $$('.sidebar__nav-item')
const sidebarSubnav = $('.sidebar__subnav')
const sidebar = $('.sidebar')
const subnavItems = Array.from($$('.sidebar__subnav-item'))
const expandSubnavBtn = $('.sidebar__item-icon.btn--expand-subnav')
const sidebarExpandBtn = $('.header__container-btn.btn--expand')
const homeBtns = $$('.header__sidebar-logo')


const app = {
    isShrinkSidebar: false,
    isExpandSubnav: false,
    suvnavHeight: 0,
    currentTab: 0,
    currentSidebarWidth: 250,
    VKUtitle: ['VKU - Trang web quản lý KTX', 'Đăng ký nội trú - VKU Admin', 'Thanh toán tiền phòng - VKU Admin', 'Thanh toán tiền điện - VKU Admin', 'Documentation - VKU Dormitory'],

    config: JSON.parse(localStorage.getItem(VKU_STORAGE_KEY) || '{}'),

    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(VKU_STORAGE_KEY, JSON.stringify(this.config))
    },

    calSubnavHeight() {
        return Array.from(subnavItems).reduce((acc, subnavItem) => {
            return acc + subnavItem.offsetHeight
        }, 0)
    },

    handleEvents() {
        const _this = this


        // Handle expand sub navigation
        function expandSubnav() {
            if (!_this.isShrinkSidebar) {
                sidebarSubnav.style.height = _this.calSubnavHeight() + 'px';
            }
            sidebarSubnav.classList.add('expand')
            expandSubnavBtn.classList.add('expand')
        }

        // Handle close sub navigation
        function closeSubnav() {
            if (!_this.isShrinkSidebar) {
                sidebarSubnav.style.height = 0;
            }
            sidebarSubnav.classList.remove('expand')
            expandSubnavBtn.classList.remove('expand')
        }


        // Handle shrink sidebar
        function shrinkSidebar() {
            if(window.innerWidth >= 740) {
                _this.currentSidebarWidth = 50;
            } else {
                _this.currentSidebarWidth = 0;
            }
            main.classList.add('has--shrink-sidebar')
            document.documentElement.style.setProperty('--sidebar-width', _this.currentSidebarWidth + 'px')
            sidebarSubnav.style.removeProperty('height')
            
            _this.isExpandSubnav = false
            closeSubnav()
        }

        // Handle expand sidebar
        function expandSidebar() {
            main.classList.remove('has--shrink-sidebar')
            _this.currentSidebarWidth = 250
            document.documentElement.style.setProperty('--sidebar-width', _this.currentSidebarWidth + 'px')
        }


        // Handle clear validate
        function handleClearAllError() {
            const formMessages = $$('.form-message')
            const formGroups = $$('.form-group')
            formMessages.forEach(formMessage => {
                formMessage.innerText = ''
            })

            formGroups.forEach(formGroup => {
                formGroup.classList.remove('invalid')
            })
        }

        // Handle switch tab
        function handleSwichTab (currentTab) {
            const activeTab = $('.container.active')
            const activeItem = $('.sidebar__subnav-item.active')
            const activeNavItems = $$('.sidebar__nav-item.active')
            
            
            activeTab.classList.remove('active')
            activeItem && activeItem.classList.remove('active')


            tabContainers[currentTab].classList.add('active')


            if(currentTab === tabContainers.length - 1) {
                sidebarItems[0].classList.contains('active') && sidebarItems[0].classList.remove('active')
                sidebarItems[1].classList.add('active')
            } else if (currentTab === 0) {
                activeNavItems.forEach(activeNavItem  => {
                    activeNavItem.classList.remove('active')
                })
            } else {
                sidebarItems[0].classList.add('active')
                subnavItems[currentTab - 1].classList.add('active')
                sidebarItems[1].classList.contains('active') && sidebarItems[1].classList.remove('active')
            }

            handleClearAllError()
            document.title = _this.VKUtitle[currentTab]
            
            _this.setConfig('currentTab', currentTab)
        }

        // Handle when click on sub navigation
        sidebarSubnav.onclick = function (e) {
            e.stopPropagation()
            const subnavItem = e.target.closest('.sidebar__subnav-item')


            _this.currentTab = subnavItems.indexOf(subnavItem) + 1
            handleSwichTab(_this.currentTab)
        }


        // Handle when click home button on header
        homeBtns.forEach((homeBtn, index) => {
            homeBtn.onclick = (e) => {
                _this.currentTab = 0
                handleSwichTab(_this.currentTab)

                this.isExpandSubnav = false
                closeSubnav()

                if(index === 1) {
                    this.isShrinkSidebar = true;
                    shrinkSidebar()
                }
    
            }
        })


        // Handle when click on sidebar navigation
        sidebarItems.forEach((sidebarItem, index) => {
            if (index === 0) {
                // First sidebar navigation item
                sidebarItem.onclick = (e) => {
                    this.isExpandSubnav = !this.isExpandSubnav
                    this.isExpandSubnav ? expandSubnav() : closeSubnav()
                }
            }
            if (index === 1) {
                // Second sidebar navigation item
                sidebarItem.onclick = (e) => {
                    this.currentTab = tabContainers.length - 1
                    handleSwichTab(this.currentTab)


                    this.isExpandSubnav = false
                    closeSubnav()
                }
            }
        })

        


        // Handle expand and shrink sidebar
        sidebarExpandBtn.onclick = (e) => {
            this.isShrinkSidebar = !this.isShrinkSidebar
            this.isShrinkSidebar ? shrinkSidebar() : expandSidebar()
        }

        // Handle when hover on shrink navigation item
        sidebarItems[0].onmouseover = (e) => {
            document.documentElement.style.setProperty('--subnav-height', this.calSubnavHeight() + 'px')
        }

        // Handle when resize window
        window.onresize = (e) => {
            if(window.innerWidth < 740) {
                this.isShrinkSidebar = true;
            } else {
                this.isShrinkSidebar = false
            }

            this.isShrinkSidebar ? shrinkSidebar() : expandSidebar()
        }

        // Handle close sidebar when click on outside area of sidebar
        document.onclick = (e) => {
            const expandBtn = e.target.closest('.header__container-btn')
            const sidebar = e.target.closest('.sidebar')
            const headerHomeBtn = e.target.closest('.header__sidebar-logo')
            if(!expandBtn && !sidebar && !headerHomeBtn) {
                if(window.innerWidth < 740) {
                    this.isShrinkSidebar = true;
                    shrinkSidebar()
                }
            }
        }

        // Set up initial close sidebar when start
        ;(function setUpInitial() {
            document.documentElement.style.setProperty('--subnav-height', _this.calSubnavHeight() + 'px')
            if(window.innerWidth < 740) {
                sidebar.style.display = 'none';
                setTimeout(function() {
                    sidebar.style.display = 'initial';
                }, 300)
                _this.isShrinkSidebar = true;
                shrinkSidebar()
            }
        })()
        

        // Handle load current tab
        ;(function loadConfig() {
            _this.currentTab = _this.config.currentTab || 0;
            handleSwichTab(_this.currentTab)
        })()


    },

    





    start() {
        // Listening / Handle DOM events
        this.handleEvents()
    }
}

app.start()

