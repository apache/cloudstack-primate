# UI customisation
Use a `public/config.json` (or `dist/config.json` after build) file for customizing theme, logos,...

## Logo
Change the logo by changing the path to the logo file as follows:
```json
{
  "logo": "assets/logo.svg"
}
```

## Theme
Customize themes like colors, border color, etc.
```json
{
  "theme": {
    "@primary-color": "#1890ff",
    "@success-color": "#52c41a",
    "@processing-color": "#1890ff",
    "@warning-color": "#faad14",
    "@error-color": "#f5222d",
    "@heading-color": "rgba(0, 0, 0, 0.85)",
    "@text-color": "rgba(0, 0, 0, 0.65)",
    "@text-color-secondary": "rgba(0, 0, 0, 0.45)",
    "@disabled-color": "rgba(0, 0, 0, 0.25)",
    "@border-color-base": "#d9d9d9"
  }
}
```

- `@primary-color` change the major background color of the page (background button, icon hover, etc).
- `@success-color` change success state color.
- `@processing-color` change processing state color. Exp: progress status.
- `@warning-color` change warning state color.
- `@error-color` change error state color.
- `@heading-color` change table header color.
- `@text-color` change major text color.
- `@text-color-secondary` change secondary text color (breadcrumb icon).
- `@disabled-color` change disable state color (disabled button, switch, etc).
- `@border-color-base` change major border color.

In addition, to add other properties, we can add `config/theme.config.js` based on the Ant Design Vue Less variable. 
Refer: https://www.antdv.com/docs/vue/customize-theme/#Ant-Design-Vue-Less-variables