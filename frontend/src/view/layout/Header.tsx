import { useState, useEffect } from 'react';

// react-router components
import { useLocation } from 'react-router-dom';

// @material-ui core components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 PRO React TS components
import MDBox from 'src/mui/components/MDBox';
import MDInput from 'src/mui/components/MDInput';
import MDBadge from 'src/mui/components/MDBadge';

// Material Dashboard 2 PRO React TS examples components
import Breadcrumbs from 'src/mui/shared/Breadcrumbs';
import NotificationItem from 'src/mui/shared/Items/NotificationItem';

// Custom styles for Header
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from 'src/mui/shared/Navbars/DashboardNavbar/styles';

// for MUI 2 Dashboard
import muiActions from 'src/modules/mui/muiActions';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';

import { useDispatch } from 'react-redux';
import UserMenu from 'src/view/layout/UserMenu';
import I18nSelect from 'src/view/layout/I18nSelect';

// Declaring prop types for Header
interface Props {
  absolute?: boolean;
  light?: boolean;
  isMini?: boolean;
}

function Header({
  absolute,
  light,
  isMini,
}: Props): JSX.Element {
  const [navbarType, setNavbarType] = useState<
    'fixed' | 'absolute' | 'relative' | 'static' | 'sticky'
  >();
  const dispatch = useDispatch();
  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = selectMuiSettings();
  const [transparentNav, setTransparentNav] = useState(
    transparentNavbar,
  );
  const [openMenu, setOpenMenu] = useState<any>(false);
  const route = useLocation().pathname.split('/').slice(1);

  useEffect(() => {
    // Setting the navbar type
    setNavbarType(fixedNavbar ? 'sticky' : 'static');

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      // dispatch(
      //   muiActions.doTransparentNavbar(
      // (fixedNavbar && document.body.scrollTop === 0) ||
      //   !fixedNavbar,
      //   ),
      // );
      setTransparentNav(
        (fixedNavbar && window.scrollY === 0) ||
          !fixedNavbar,
      );
    }

    /**
     * The event listener that's calling the handleTransparentNavbar function when
     * scrolling the window.
     */
    window.addEventListener(
      'scroll',
      handleTransparentNavbar,
    );

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () =>
      window.removeEventListener(
        'scroll',
        handleTransparentNavbar,
      );
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => {
    window.innerWidth >= 1200 &&
      dispatch(
        muiActions.doSave({
          miniSidenav: !miniSidenav,
        }),
      );
    dispatch(muiActions.doMiniSidenav(!miniSidenav));
  };
  const handleConfiguratorOpen = () => {
    dispatch(
      muiActions.doOpenConfigurator(!openConfigurator),
    );
  };
  const handleOpenMenu = (event: any) =>
    setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        icon={<Icon>email</Icon>}
        title="Check new messages"
      />
      <NotificationItem
        icon={<Icon>podcasts</Icon>}
        title="Manage Podcast sessions"
      />
      <NotificationItem
        icon={<Icon>shopping_cart</Icon>}
        title="Payment successfully completed"
      />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }: {
    palette: any;
    functions: any;
  }) => ({
    color: () => {
      let colorValue =
        light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode
          ? rgba(text.main, 0.6)
          : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? 'absolute' : navbarType}
      color="inherit"
      sx={(theme) =>
        navbar(theme, {
          transparentNavbar: transparentNav,
          absolute,
          light,
          darkMode,
        })
      }
    >
      <Toolbar sx={navbarContainer}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route}
            light={light}
          />
          <IconButton
            onClick={handleMiniSidenav}
            size="small"
            disableRipple
          >
            <Icon fontSize="medium" sx={iconsStyle}>
              {miniSidenav ? 'menu_open' : 'menu'}
            </Icon>
          </IconButton>
        </MDBox>
        {isMini ? null : (
          <MDBox
            sx={(theme) => navbarRow(theme, { isMini })}
          >
            <MDBox pr={0.8}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? 'white' : 'inherit'}>
              <I18nSelect />
              <UserMenu />
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
                disableRipple
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Declaring default props for Header
Header.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

export default Header;
