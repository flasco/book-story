import ReactDOM from 'react-dom';
import {
  JSXElementConstructor,
  memo,
  ReactElement,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';

type Children = ReactElement<any, string | JSXElementConstructor<any>> | null;
interface Props {
  activeName?: string;
  includeKeys?: Array<string>;
  maxLen?: number;
  children: Children;
}
function KeepAlive({ activeName, children, includeKeys, maxLen = 10 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const components = useRef<Array<{ name: string; ele: Children }>>([]);

  useEffect(() => {
    /** 同步机制 */
    if (includeKeys) {
      components.current = components.current.filter(({ name }) => includeKeys.includes(name));
    }
  }, [includeKeys]);

  useEffect(() => {
    if (activeName == null) {
      return;
    }
    const curComponent = components.current;
    // 缓存超过上限的
    if (curComponent.length >= maxLen) {
      components.current = curComponent.slice(1);
    }
    // 如果不存在 cache 就 add 一个
    if (!curComponent.find(res => res.name === activeName)) {
      curComponent.push({
        name: activeName,
        ele: children,
      });
    }
  }, [children, activeName, includeKeys]);

  return (
    <>
      <div ref={containerRef} className="keep-alive" />
      {components.current.map(({ name, ele }) => (
        <Component active={name === activeName} renderDiv={containerRef} name={name} key={name}>
          {ele}
        </Component>
      ))}
    </>
  );
}

export default memo(KeepAlive);

interface ComponentProps {
  active: boolean;
  children: Children;
  name: string;
  renderDiv: RefObject<HTMLDivElement>;
}

function Component({ active, children, name, renderDiv }: ComponentProps) {
  const targetElement = useMemo(() => document.createElement('div'), []);
  const activatedRef = useRef(false);
  activatedRef.current = activatedRef.current || active;
  useEffect(() => {
    if (active) {
      renderDiv.current?.appendChild(targetElement);
    } else {
      try {
        renderDiv.current?.removeChild(targetElement);
      } catch (e) {}
    }
  }, [active, name, renderDiv, targetElement]);
  useEffect(() => {
    targetElement.setAttribute('id', name);
  }, [name, targetElement]);
  return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>;
}
