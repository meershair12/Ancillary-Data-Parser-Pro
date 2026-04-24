export const appConfig = {
    appName:{first:"Medi", second:"Extract"},
    version: "v4.8.7",
    color:{
        primary:"#74B87B"
    }
};

export const THEME_STORAGE_KEY = "theme";
export const THEME_MODES = {
    SYSTEM: "system",
    LIGHT: "light",
    DARK: "dark"
};
export const THEME_CHANGE_EVENT = "app-theme-change";

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
const isValidThemeMode = (value) => Object.values(THEME_MODES).includes(value);

const getSystemTheme = () => {
    if (!isBrowser() || !window.matchMedia) {
        return THEME_MODES.DARK;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEME_MODES.DARK
        : THEME_MODES.LIGHT;
};

const emitThemeChange = (themeMode, resolvedThemeMode) => {
    if (!isBrowser()) {
        return;
    }

    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, {
        detail: {
            themeMode,
            resolvedThemeMode
        }
    }));
};

export const getStoredThemeMode = () => {
    if (!isBrowser()) {
        return THEME_MODES.SYSTEM;
    }
    const savedThemeMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidThemeMode(savedThemeMode) ? savedThemeMode : THEME_MODES.SYSTEM;
};

export const getResolvedThemeMode = (themeMode = getStoredThemeMode()) => {
    if (themeMode === THEME_MODES.SYSTEM) {
        return getSystemTheme();
    }
    return themeMode;
};

export const applyTheme = (themeMode = getStoredThemeMode()) => {
    if (!isBrowser()) {
        return THEME_MODES.DARK;
    }

    const resolvedThemeMode = getResolvedThemeMode(themeMode);
    const isLightTheme = resolvedThemeMode === THEME_MODES.LIGHT;

    document.body.classList.toggle("light", isLightTheme);
    document.body.classList.toggle("dark", !isLightTheme);
    document.documentElement.style.colorScheme = isLightTheme ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", resolvedThemeMode);
    emitThemeChange(themeMode, resolvedThemeMode);

    return resolvedThemeMode;
};

export const setThemeMode = (themeMode) => {
    const nextThemeMode = isValidThemeMode(themeMode) ? themeMode : THEME_MODES.SYSTEM;

    if (isBrowser()) {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode);
    }

    applyTheme(nextThemeMode);
    return nextThemeMode;
};

export const initThemeSync = () => {
    if (!isBrowser() || !window.matchMedia) {
        return () => {};
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
        if (getStoredThemeMode() === THEME_MODES.SYSTEM) {
            applyTheme(THEME_MODES.SYSTEM);
        }
    };

    applyTheme(getStoredThemeMode());

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
};

// Kept for compatibility with existing imports.
export const theme = () => applyTheme(getStoredThemeMode());

export const subscribeToThemeChanges = (onThemeChange) => {
    if (!isBrowser()) {
        return () => {};
    }

    const handleThemeChange = (event) => {
        if (typeof onThemeChange === "function") {
            onThemeChange(event?.detail?.resolvedThemeMode || getResolvedThemeMode());
        }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
};