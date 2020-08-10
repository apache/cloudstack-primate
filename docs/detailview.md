## Resource Detail View Customisation

From the List View of the resources, on can navigate to the individual
  resource's detail view, which in CloudStack Primate we refer to as the
  *Resource View* by click on the specific resource.
The Resource View has 2 sections:
- InfoCard to the left that has basic / minimal details of that resource along
  with the related entities
- DetailsTab to the right which provide the basic details about the resource.

Custom tabs to render custom details, addtional information of the resource
  The list of fields to be displayed maybe defined as an array
  or a function in case we need to selectively (i.e., based on certain
  conditions) restrict the view of certain columns. The names specified in the
  details array should correspond to the api parameters

For example,

```
    ...
    details: ['name', 'id', 'displaytext', 'projectaccountname', 'account', 'domain'],
    ...
    // To render the above mentioned details in the right section of the Resource View, we must import the DetailsTab
    tabs: [
    {
      name: 'details',
      component: () => import('@/components/view/DetailsTab.vue')
    },
    ...
    ]
```

Additional tabs can be defined by adding on to the tabs section.
