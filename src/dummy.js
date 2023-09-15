import "@src/App.css";
import "./roles.css";

import { Inlay, RoleCard } from "@alice/component_library/";
import { Grid } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import classNames from "classnames";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  getOrganisationScope,
  GetRolesEntitlementData,
  removeselectedRoles,
  selectedRoles,
  SetSnackBar,
  StoreSearchKeyword,
  updateRoleData,
} from "@actions";
import { SecondaryButton } from "@components/button";
import Loader from "@components/Loader";
import RoleDetailsOpen from "@components/rolesData";
import { formatNumber } from "@utils/numberFormat";
import { hasData } from "@utils/Validator";
import RoleEditOptions from "./roleEditOptions";

const styles = (theme) => ({
  subInley: {
    [theme.breakpoints.down("md")]: {
      whiteSpace: "normal",
      width: "97%",
    },
  },
  showButtons: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  ml: {
    [theme.breakpoints.up("md")]: {
      marginLeft: "60px",
    },
    justifyContent: "center",
  },
  showFirst: {
    marginLeft: "-8px !important",
  },
  showMeg: {
    marginTop: "15px",
    marginLeft: "20px",
  },
  roleCardContainer: {
    display: "flex",
    "& > .MuiPaper-root": {
      flexGrow: 1,
    },
  },
});

//Get current breakpoint
function useBreakpoints() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || "xs"
  );
}

const RolesPanelCard = (props) => {
  const { t } = useTranslation();
  const { classes, setRoleData, showMoreButton, showMaxLimitMsg } = props;
  const { showAll, loadMore, loadLess } = props;
  const dispatch = useDispatch();
  const breakpoint = useBreakpoints();

  const roleData = props.roledata;

  const [numCols, setNumCols] = useState(1);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [anchorEle, setAnchorEle] = useState(null);
  const [inlayIndex, setInlayIndex] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [inlayContent, setInlayContent] = useState(null);

  const userUtils = useSelector((state) => state.util);
  const slRoles = useSelector((state) => state.role.selectedRoles);
  const count = useSelector((state) => state.role.count);
  const totalCount = useSelector((state) => state.role.totalCount);
  const displayCount = count >= totalCount ? totalCount : count;

  const resetActiveButtons = () => {
    let array = gridData.map((role) => {
      role.config = {
        ...role.config,
        addActive: false,
        infoActive: false,
        editActive: false,
      };
      return role;
    });

    setGridData(array);
  };

  const closeInlay = () => {
    resetActiveButtons();
    setActiveCardIndex(null);
  };

  const deSelectCard = async (value) => {
    dispatch(
      SetSnackBar({
        message: t("role_removed_successfully"),
        show: true,
      })
    );
    const data = [...roleData];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === value) {
        data[i].selected = !data[i].selected;
        data[i].selectedScopes = [];
        await setRoleData(data);
        await dispatch(removeselectedRoles(data[i].id));
      }
    }
    await updateRoleData(data);
  };

  const selectCard = async (value) => {
    const data = [...roleData];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === value) {
        if (data[i].selected === true) {
          data[i].selected = true;
          dispatch(
            SetSnackBar({
              message: t("role_removed_successfully"),
              show: true,
            })
          );
        } else {
          data[i].selected = !data[i].selected;
        }
        if (data[i].isAddRoleOpen) {
          dispatch(
            SetSnackBar({
              message: t("role_added_successfully"),
              show: true,
            })
          );
          data[i].isAddRoleOpen = false;
        }
        await setRoleData(data);
        if (data[i].selected === true) {
          const selectedData = data[i];

          await dispatch(selectedRoles(selectedData));
        }
      }
    }

    await dispatch(updateRoleData(data));
    closeInlay();
  };

  const infoInlay = (data, id) => {
    return (
      <RoleDetailsOpen roleData={data} setDetailsChange={() => closeInlay()} />
    );
  };

  const editInlay = (data, isEdit) => {
    return (
      <RoleEditOptions
        setEditOptionsChange={() => closeInlay()}
        id={data.id}
        isAddRoleOpen={!isEdit}
        addRoledata={data}
      />
    );
  };

  const addInlay = (data, isEdit) => {
    return (
      <RoleEditOptions
        setEditOptionsChange={() => closeInlay()}
        selectCard={() => selectCard(data.id)}
        id={data.id}
        isAddRoleOpen={!isEdit}
        addRoledata={data}
      />
    );
  };

  const openInlay = (index, anchor) => {
    resetActiveButtons();
    setActiveCardIndex(index);
    setAnchorEle(anchor);
  };

  const onCardInfo = async (index, role, event) => {
    const data = [...roleData];
    const isInfoActive = role.config.infoActive;
    if (isInfoActive) {
      closeInlay();
      role.config.infoActive = !isInfoActive;
    } else {
      openInlay(index, event.currentTarget);
      setInlayContent(infoInlay(role));
      role.config.infoActive = !isInfoActive;
      const filteredData = data.filter((elem) => elem.id === role.id);
      if (filteredData && filteredData.length > 0) {
        await dispatch(GetRolesEntitlementData(filteredData[0].id));
      } else {
        await dispatch(StoreSearchKeyword());
      }
    }
  };

  const onCardAdd = async (index, role, event) => {
    const isAddActive = role.config.addActive;
    const data = [...roleData];
    if (isAddActive) {
      closeInlay();
    } else {
      openInlay(index, event.currentTarget);
      setInlayContent(addInlay(role, false));
      const filteredData = data.filter((elem) => elem.id === role.id);
      if (filteredData && filteredData.length > 0) {
        if (
          filteredData[0].needsOrgScopes === true &&
          filteredData[0].isAddRoleOpen === true
        ) {
          const displayUser = !hasData(props.selectedUserdata)
            ? userUtils.userData
            : props.selectedUserdata;

          await dispatch(
            getOrganisationScope(displayUser.id, filteredData[0].id)
          );
        }
      }
    }
    role.config.addActive = !isAddActive;
  };

  const onCardEdit = (index, role, event) => {
    const isEditActive = role.config.editActive;
    if (isEditActive) {
      closeInlay();
    } else {
      openInlay(index, event.currentTarget);
      setInlayContent(editInlay(role, true));
    }
    role.config.editActive = !isEditActive;
  };

  const onCardDelete = (index, role, event) => {
    closeInlay();
    deSelectCard(role.id);
  };

  const onCloseInlay = () => {
    closeInlay();
  };

  useEffect(() => {
    //Set breakpoints for grid
    switch (breakpoint) {
      case "sm":
        setNumCols(1);
        break;
      case "md":
      case "lg":
        setNumCols(2);
        break;
      case "xl":
      case "xxl":
        setNumCols(3);
        break;
      default: {
        setNumCols(1);
      }
    }
  }, [breakpoint]);

  useEffect(() => {
    if (activeCardIndex !== null) {
      setInlayIndex(activeCardIndex + (numCols - (activeCardIndex % numCols)));
    } else {
      setInlayIndex(false);
    }
  }, [activeCardIndex, numCols]);

  useEffect(() => {
    let array = roleData.map((role) => {
      role.config = {
        addActive: false,
        infoActive: false,
        editActive: false,
        selected: false,
      };
      return role;
    });
    setGridData(array);
  }, [roleData]);

  useEffect(() => {
    const rolesSelected = slRoles.map((d) => d.id);
    let array = roleData.map((role) => {
      role.config = {
        addActive: false,
        infoActive: false,
        editActive: false,
        selected: rolesSelected.includes(role.id),
      };
      return role;
    });
    setGridData(array);
  }, [slRoles, roleData]);

  let grid = gridData.map((role, i) => {
    return (
      <Grid
        key={i}
        className={classes.roleCardContainer}
        item
        xs={12}
        md={6}
        xl={4}
        sx={{ display: "grid" }}
      >
        <RoleCard
          roleData={role}
          roleConfig={role.config}
          onInfoClick={(e) => onCardInfo(i, role, e)}
          onAddClick={(e) => onCardAdd(i, role, e)}
          onEditClick={(e) => onCardEdit(i, role, e)}
          onDeleteClick={(e) => onCardDelete(i, role, e)}
        />
      </Grid>
    );
  });

  if (inlayIndex) {
    grid.splice(
      inlayIndex,
      0,
      <Grid key="inlay" item xs={12}>
        <Inlay
          anchorElement={anchorEle}
          open={Boolean(anchorEle)}
          onClose={onCloseInlay}
        >
          {inlayContent}
        </Inlay>
      </Grid>
    );
  }

  return (
    <div style={{ minWidth: "100%" }}>
      <Grid container spacing={2}>
        {grid}
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        className={classNames(
          "text-align-center mt-8vh",
          classes.ml,
          classes.showButtons
        )}
      >
        {showMoreButton ? (
          <Loader />
        ) : (
          <>
            <SecondaryButton
              label={
                showMaxLimitMsg || displayCount === totalCount
                  ? t("show-less")
                  : t("load-more")
              }
              onButtonClick={
                showMaxLimitMsg || displayCount === totalCount
                  ? () => loadLess()
                  : () => loadMore()
              }
              className="mr-26"
            />

            {props.totalCount < 500 ? (
              <SecondaryButton
                label={t("user_showAll")}
                onButtonClick={() => showAll()}
                DisabledButton={displayCount === totalCount}
              />
            ) : (
              <SecondaryButton
                label={t("show-500roles")}
                onButtonClick={() => showAll()}
                DisabledButton={showMaxLimitMsg}
                className={classes.showFirst}
              />
            )}
          </>
        )}
      </Grid>

      {roleData && roleData.length > 0 ? (
        <Grid
          item
          xs={10}
          sm={10}
          md={12}
          lg={12}
          className="text-align-center display-block clr-grey mb-2vh"
        >
          <div className={classes.showMeg}>
            {formatNumber(displayCount)} / {formatNumber(totalCount)}{" "}
            {t("roles_shown")}
          </div>
        </Grid>
      ) : null}
      {totalCount > 500 && showMaxLimitMsg && (
        <span className="display-block p-40 text-align-center">
          {t("max-count-restricted")}
        </span>
      )}
    </div>
  );
};

export default withStyles(styles)(RolesPanelCard);
