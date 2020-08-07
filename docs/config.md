## Configuration

### Section Config Definition

A new section may be added in `src/config/section` and in `src/config/router.js`
import the new section (newconfig.js as example) configuration file and rules to
`asyncRouterMap` as:

    import newconfig from '@/config/section/newconfig'

    [ ... snipped ... ]

      generateRouterMap(newSection),


### Section

An existing or new section config/js file must export the following parameters:

- `name`: Unique path in URL
- `title`: The name to be displayed in navigation and breadcrumb
- `icon`: The icon to be displayed, from AntD's icon set
  https://vue.ant.design/components/icon/
- `docHelp`: Allows to provide a link to a document to provide details on the
  section
- `searchFilters`: List of parameters by which the resources can be filtered
  via the list API
- `children`: (optional) Array of resources sub-navigation under the parent
  group
- `permission`: When children are not defined, the array of API to check against
  allowed auto-discovered APIs
- `columns`: When children is not defined, list of column keys
- `component`: When children is not defined, the custom component for rendering
  the route view


See `src/config/section/compute.js` and `src/config/section/project.js` for example.

The children should have:

- `name`: Unique path in the URL
- `title`: The name to be displayed in navigation and breadcrumb
- `icon`: The icon to be displayed, from AntD's icon set
  https://vue.ant.design/components/icon/
- `permission`: The array of API to check against auto-discovered APIs
- `columns`: List of column keys for list view rendering
- `details`: List of keys for detail list rendering for a resource
- `tabs`: Array of custom components that will get rendered as tabs in the
  resource view
- `component`: The custom component for rendering the route view
  default list view (table)
- `related`: A list of associated entitiy types that can be listed via passing
  the current resource's id as a parameter in their respective list api
- `actions`: Arrays of actions that can be performed on the resource.
  Refer : [action.md](https://github.com/apache/cloudstack-primate/blob/master/docs/action.md)
