import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "./../../components/Container";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorMode,
} from "@chakra-ui/react";
import FullPageSpinner from "./../../components/rootComponents/FullPageSpinner";
import Navbar from "./../../components/rootComponents/Navbar";
import Footer from "./../../components/rootComponents/Footer";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useDrop } from "react-dnd";
import {
  ItemStatus,
  useGetProjectByIdQuery,
  Item,
} from "./../../generated/graphql";
import SideBar from "./../../components/layout/SideBar";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import ItemSprintBox from "./../../components/layout/ItemSprintBox";

interface projectsProps {}

type itemQuery = {
  __typename?: "Item";
} & Pick<
  Item,
  "id" | "description" | "summary" | "status" | "priority" | "type"
>;

const Project: React.FC<projectsProps> = ({}) => {
  const router = useRouter();

  let previousItemStatus: string = "";

  const [expand, setExpand] = useState(true);
  const [sideBarWidth, setSideBarWidth] = useState("0px");
  const [pageWidth, setPageWidth] = useState("3em");

  const [pendingItens, setPendingItens] = useState<Array<itemQuery>>([]);
  const [progressItens, setProgressItens] = useState<Array<itemQuery>>([]);
  const [doneItens, setDoneItens] = useState<Array<itemQuery>>([]);

  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.200", dark: "gray.800" };
  const color = { light: "black", dark: "white" };

  const { project } = router.query;
  const [{ data, fetching, error }, reexecuteQuery] = useGetProjectByIdQuery({
    variables: {
      id: typeof project === "string" ? project : "",
    },
    pause: true,
  });

  const [{ canDropPending }, dropRefPending] = useDrop({
    accept: "item",
    canDrop: (item: itemQuery) => {
      return !!!pendingItens.find((element) => element.id === item.id);
    },

    drop: (item: itemQuery) => {
      previousItemStatus = item.status;

      // firts update item status
      if (item.status === ItemStatus.InProgress) {
        item.status = ItemStatus.Open;
      } else {
        item.status = ItemStatus.Reopened;
      }

      setPendingItens((prevItens) => [...prevItens, item]);

      // Remoção do item no array anterior dele.
      removeItemFromStatusArray(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropPending: monitor.canDrop(),
    }),
  });

  const [{ candropProgress }, dropRefProgress] = useDrop({
    accept: "item",

    canDrop: (item: itemQuery) => {
      return !!!progressItens.find((element) => element.id === item.id);
    },

    drop: (item: itemQuery) => {
      previousItemStatus = item.status;

      // firts update item status
      item.status = ItemStatus.InProgress;

      setProgressItens((prevItens) => [...prevItens, item]);
      removeItemFromStatusArray(item);
    },

    hover: (_, monitor) => {
      monitor.isOver({ shallow: true });
    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
      candropProgress: monitor.canDrop(),
    }),
  });

  const [{ canDropDone }, dropRefDone] = useDrop({
    accept: "item",

    canDrop: (item: itemQuery) => {
      return (
        !!!doneItens.find((element) => element.id === item.id) &&
        item.status !== ItemStatus.Open &&
        item.status !== ItemStatus.Reopened
      );
    },

    drop: (item: itemQuery) => {
      previousItemStatus = item.status;

      // firts update item status
      item.status = ItemStatus.Resolved;

      setDoneItens((prevItens) => [...prevItens, item]);
      removeItemFromStatusArray(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropDone: monitor.canDrop(),
    }),
  });

  const removeItemFromStatusArray = (item: itemQuery): void => {
    switch (previousItemStatus) {
      case ItemStatus.Open:
        if (pendingItens.length) {
          setPendingItens(pendingItens.filter((_item) => item.id !== _item.id));
        }
        break;
      case ItemStatus.Reopened:
        if (pendingItens.length) {
          setPendingItens(pendingItens.filter((_item) => item.id !== _item.id));
        }
        break;
      case ItemStatus.InProgress:
        if (progressItens.length) {
          setProgressItens(
            progressItens.filter((_item) => item.id !== _item.id)
          );
        }
        break;
      case ItemStatus.Completed:
        if (doneItens.length) {
          setDoneItens(doneItens.filter((_item) => item.id !== _item.id));
        }
        break;
      case ItemStatus.Resolved:
        if (doneItens.length) {
          setDoneItens(doneItens.filter((_item) => item.id !== _item.id));
        }
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (fetching) return;
    loadItensByTypes();
    reexecuteQuery({ requestPolicy: "cache-and-network" });
  }, [fetching, reexecuteQuery]);

  // if (data && data.getProjectById.errors)
  //     return  ( data.getProjectById.errors.map((erro) => <p>{erro.message}</p>) );

  useEffect(() => {
    return () => {
      setDoneItens([]);
      setPendingItens([]);
      setProgressItens([]);
    };
  }, []);

  const handleExpandSideBar = (): void => {
    setExpand(!expand);

    if (expand) {
      setSideBarWidth("215px");
      setPageWidth("20em");
    } else {
      setSideBarWidth("0px");
      setPageWidth("3em");
    }
  };

  const loadItensByTypes = (): void => {
    if (!(data && data.getProjectById?.project?.sprints[0]?.itens)) {
      return;
    }

    data.getProjectById?.project?.sprints[0]?.itens?.map((item) => {
      switch (item.status) {
        case ItemStatus.Open:
          setPendingItens((prevItens) => [...prevItens, item]);
          break;
        case ItemStatus.Reopened:
          setPendingItens((prevItens) => [...prevItens, item]);
          break;
        case ItemStatus.InProgress:
          setProgressItens((prevItens) => [...prevItens, item]);
          break;
        case ItemStatus.Completed:
          setDoneItens((prevItens) => [...prevItens, item]);
          break;
        case ItemStatus.Resolved:
          setDoneItens((prevItens) => [...prevItens, item]);
          break;
      }
    });
  };

  if (error) return <p>Oh no... {error.message}</p>;

  const loading = <FullPageSpinner />;

  const content = (
    <Container>
      <Navbar />
      <SideBar
        projectName={data && data.getProjectById.project.name}
        width={sideBarWidth}
        visibility={expand ? "hidden" : "visible"}
      />
      <Flex
        p={2}
        mt="1em"
        mb="1em"
        ml={pageWidth}
        overflowX="hidden"
        transition="0.3s"
      >
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <IconButton
              isRound={true}
              aria-label="Switch Theme"
              icon={expand ? <ArrowLeftIcon /> : <ArrowRightIcon />}
              onClick={handleExpandSideBar}
            />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/project">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/project/${project}`}>
              {data && data.getProjectById.project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Flex
        mt="1em"
        mb="1em"
        ml={pageWidth}
        overflowX="hidden"
        transition="0.3s"
      >
        <Text fontSize="3xl">{data && data.getProjectById.project.name}</Text>
      </Flex>
      <Flex flexDir="row" ml={pageWidth} overflowX="hidden" transition="0.3s">
        <Flex
          border={canDropPending ? "1px dashed" : "none"}
          minH="150px"
          flexGrow={1}
          boxShadow="lg"
          flexDir="column"
          p={3}
          m="2em 2em 20em 0"
          bg={bgColor[colorMode]}
          color={color[colorMode]}
          ref={dropRefPending}
        >
          <Text size="lg">PEDNDING</Text>
          {pendingItens.length &&
            pendingItens.map((item) => (
              <ItemSprintBox draggable key={item.id} item={item} />
            ))}
        </Flex>

        <Flex
          border={candropProgress ? "1px dashed" : "none"}
          minH="150px"
          flexGrow={1}
          boxShadow="lg"
          flexDir="column"
          p={3}
          m="2em 2em 20em 0"
          bg={bgColor[colorMode]}
          color={color[colorMode]}
          ref={dropRefProgress}
        >
          <Text size="lg">IN PROGRESS</Text>
          {progressItens.length &&
            progressItens.map((item) => (
              <ItemSprintBox draggable key={item.id} item={item} />
            ))}
        </Flex>
        <Flex
          border={canDropDone ? "1px dashed" : "none"}
          minH="150px"
          flexGrow={1}
          boxShadow="lg"
          flexDir="column"
          p={3}
          m="2em 2em 20em 0"
          bg={bgColor[colorMode]}
          color={color[colorMode]}
          ref={dropRefDone}
        >
          <Text size="lg">DONE</Text>
          {doneItens.length &&
            doneItens.map((item) => (
              <ItemSprintBox draggable key={item.id} item={item} />
            ))}
        </Flex>
      </Flex>
      <Box id="footer">
        <Footer />
      </Box>
    </Container>
  );

  return fetching ? loading : content;
};

export default Project;
