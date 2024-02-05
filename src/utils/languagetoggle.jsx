import React from "react";
import { withLocalize } from "react-localize-redux";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Snackbar, Button } from '@material-ui/core'
import { Language } from '@material-ui/icons'

const LanguageToggle = ({ languages, activeLanguage, setActiveLanguage, close }) => {

    const [open, setOpen] = React.useState(false);

    const doClose = (code) => {

        if (code == "fr" || code == "rw") {
            handleUnavailable();
            return;
        }

        setActiveLanguage(code)
        close(code)
    }

    const handleUnavailable = () => {
        setOpen(!open);
    };
    return (

        <>
            <Snackbar
                onClose={handleUnavailable}
                action={
                    <Button color="secondary" onClick={handleUnavailable}>
                        Close
          </Button>
                }
                open={open}
                autoHideDuration={3000}
                message="This language is not currently available in this version mode"
            />
            <List dense fullWidth>
                {languages.map(lang => (
                    <ListItem button onClick={() =>

                        doClose(lang.code)

                    }>
                        <ListItemAvatar><Avatar><Language /></Avatar></ListItemAvatar>
                        <ListItemText primary={lang.name} secondary={lang.code === activeLanguage.code ? 'active' : ''} />
                    </ListItem>

                ))}
            </List>
        </>

    );
}

export default withLocalize(LanguageToggle);
