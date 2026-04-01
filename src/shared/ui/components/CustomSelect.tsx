import Select from '@mui/material/Select'

export default function CustomSelect ({children, value, onChange}:any){
  return <Select
    defaultValue={0}
    value={value}
    onChange={onChange}
    MenuProps={{
      PaperProps: {
        sx: {
          borderRadius: "6px",
          marginTop: "6px",

          "& .MuiMenuItem-root": {
            fontSize: "14px",

            "&:hover": {
              backgroundColor: "var(--custom-component-hover)",
              color: "#fff",
            },
          },
        },
      },
    }}
    sx={{
      minWidth: 100,
      height: 44,
      borderRadius: "6px",
      backgroundColor: "var(--custom-component-color)",
      color: "#fff",

      "& .MuiSelect-select": {
        padding: "10px 14px",
      },

      "& .MuiSvgIcon-root": {
        color: "#fff",
      },

      "& fieldset": {
        border: "none",
      },

      "&:hover": {
        backgroundColor: "var(--custom-component-hover)",
      },

      "&.Mui-focused": {
        backgroundColor: "#35b6e8",
      },
    }}
  >
    {children}
  </Select>
}
