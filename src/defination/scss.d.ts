declare module '*.m.scss' {
  const content: {
    [key: string]: string;
  };
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

interface PureObject {
  [key: string]: any;
}
