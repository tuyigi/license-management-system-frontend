import React, { useEffect, useState } from "react";

import Login from "./pages/Authentication/login.jsx";
import BnrHome from "./pages/Admin/home.jsx";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize } from "react-localize-redux";

import translations_en from "./translations/en.translations.json";
import translations_rw from "./translations/rw.translations.json";
import translations_fr from "./translations/fr.translations.json";

import { SnackbarProvider } from "notistack";


function Translator(props) {

  useEffect(() => {
    props.initialize({
      languages: [
        { name: "Kinyarwanda", code: "rw" },
        { name: "English", code: "en" },
        { name: "Francais", code: "fr" },
      ],

      translation: translations_rw,
      options: { renderToStaticMarkup, defaultLanguage: "en" },
    });

    props.addTranslationForLanguage(translations_rw, "rw");
    props.addTranslationForLanguage(translations_en, "en");
    props.addTranslationForLanguage(translations_fr, "fr");
  }, []);

  return (
    <SnackbarProvider
      preventDuplicate
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      maxSnack={2}
    >
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Login {...props} />} />
          <Route exact path="/bnr" component={() => <BnrHome {...props} />} />
          {/* <Route component={() => <NotFound full={true} />} /> */}
        </Switch>
      </Router>
    </SnackbarProvider>
  );
}

export default withLocalize(Translator);