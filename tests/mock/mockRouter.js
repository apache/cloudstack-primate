import VueRouter from 'vue-router'

const mockRouter = {
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { icon: 'home' },
      redirect: '/test-router-1',
      children: [
        {
          name: 'testRouter1',
          path: '/test-router-1',
          meta: {
            icon: 'test-router-1',
            permission: ['testRouter1']
          }
        }
      ]
    }
  ],
  mock: (routes = []) => {
    if (routes && routes.length > 0) {
      mockRouter.routes[0].children = [...mockRouter.routes[0].children, ...routes]
    }

    return new VueRouter({ routes: mockRouter.routes })
  }
}

export default mockRouter
