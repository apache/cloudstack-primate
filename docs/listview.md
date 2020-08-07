## Custom Resource List View

After having, defined a section and the actions that can be performed in the
 particular section; on navigating to the section, we can have a list of
 resources available, for example, On navigating to **Compute > Instances**
 section, we see a list of all the VM instances (each instance referred to as a
 resource).

The columns that should be made available while displaying the list of
  resources can be defined in the section's configuration file under the
  columns attribute (as mentioned above). **Columns** maybe defined as an array
  or a function in case we need to selectively (i.e., based on certain
  conditions) restrict the view of certain columns.

It also contains router-links to the resouce and other related data such as the
  account, domain, etc of the resource if present

For example:

```
    ...
    // columns defined as an array
    columns: ['name', 'state', 'displaytext', 'account', 'domain'],

    // columns can also be defined as a function, so as to conditionally restrict view of certain columns
    columns: () => {
        var fields = ['name', 'hypervisor', 'ostypename']
        if (['Admin', 'DomainAdmin'].includes(store.getters.userInfo.roletype)) {
          fields.push('account')
        }
        ...
    }
```
