/*
 * 创建日期: 2024-12-XX
 * 文件说明: 思维导图编辑器组件，使用 React Flow 实现
 * 作者: Yann
 * 模块: components
 * 版本: 3.0
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Save as SaveIcon,
  AccountTree as AccountTreeIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { usersApi, mindMapsApi, MindMapRequest } from '../services/api';
import { 
  generateVideoScriptPrompt, 
  generateSimpleVideoScriptPrompt, 
  generateAdvancedVideoScriptPrompt 
} from '../prompts';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

// 思维导图节点数据接口
interface MindMapNodeData {
  label: string;
  level: number;
  color: string;
  onEdit: (id: string, newLabel: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (id: string) => void;
}

// FitView 处理组件
const FitViewHandler: React.FC<{ needsFitView: boolean; setNeedsFitView: (value: boolean) => void }> = ({ 
  needsFitView, 
  setNeedsFitView 
}) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (needsFitView) {
      // 使用 requestAnimationFrame 确保在下一帧执行，避免卡顿
      requestAnimationFrame(() => {
        fitView({ 
          padding: 0.15,
          duration: 300, // 减少动画时间，提高响应速度
          includeHiddenNodes: false
        });
        setNeedsFitView(false);
      });
    }
  }, [needsFitView, fitView, setNeedsFitView]);

  return null;
};



// 自定义思维导图节点组件
const MindMapNode: React.FC<NodeProps<MindMapNodeData>> = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label);

  // 同步 editText 与 data.label
  useEffect(() => {
    setEditText(data.label);
  }, [data.label]);

  const handleSave = () => {
    if (editText.trim()) {
      console.log('Saving node edit:', id, editText.trim());
      data.onEdit(id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      // Ctrl+Enter 保存并退出编辑
      handleSave();
    } else if (e.key === 'Escape') {
      // Escape 取消编辑
      setEditText(data.label);
      setIsEditing(false);
    }
    // Enter 键单独按下时允许换行（默认行为）
  };

  return (
    <Box
      sx={{
        padding: '12px 16px',
        backgroundColor: data.color,
        color: 'white',
        borderRadius: '12px',
        minWidth: '120px',
        maxWidth: '400px', // 进一步增加最大宽度
        minHeight: '40px',
        border: selected ? '3px solid #333' : '2px solid transparent',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
        cursor: isEditing ? 'text' : 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        wordBreak: 'break-word', // 允许长词换行
        overflowWrap: 'break-word', // 更好的换行支持
        '&:hover': {
          transform: isEditing ? 'none' : 'scale(1.02)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
        }
      }}
      onClick={(e) => {
        // 不阻止事件传播，让ReactFlow处理节点选择
        const target = e.target as HTMLElement;
        const isButtonClick = target.closest('button') || target.closest('[role="button"]');
        const isHandleClick = target.closest('.react-flow__handle');
        console.log('Node clicked:', id, 'isButtonClick:', isButtonClick, 'isHandleClick:', isHandleClick, 'isEditing:', isEditing, 'selected:', selected);
        
        // 如果点击的是按钮或连接点，阻止事件传播
        if (isButtonClick || isHandleClick) {
          e.stopPropagation();
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const isButtonClick = target.closest('button') || target.closest('[role="button"]');
        const isHandleClick = target.closest('.react-flow__handle');
        
        // 双击进入编辑模式（除非点击的是按钮或连接点）
        if (!isButtonClick && !isHandleClick && !isEditing) {
          console.log('Double click - Setting editing mode for node:', id);
          setIsEditing(true);
        }
      }}
    >
      {/* 连接点 */}
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />

      {isEditing ? (
        <TextField
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          multiline
          variant="standard"
          InputProps={{
            disableUnderline: true,
            style: {
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.3,
            }
          }}
          sx={{
            width: '100%',
            '& .MuiInput-input': {
              textAlign: 'center',
              color: 'white !important',
              padding: 0,
              resize: 'none',
              overflow: 'hidden',
            },
            '& textarea': {
              textAlign: 'center',
              color: 'white !important',
              padding: 0,
              resize: 'none',
              overflow: 'hidden',
              lineHeight: 1.3,
            }
          }}
        />
      ) : (
        <Typography
          variant="body2"
          onDoubleClick={(e) => {
            e.stopPropagation();
            console.log('Typography double clicked, entering edit mode for node:', id);
            setIsEditing(true);
          }}
          sx={{
            color: 'white',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            lineHeight: 1.3,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap', // 保留换行符和空格
            minHeight: '20px',
            cursor: 'pointer',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
            }
          }}
        >
          {data.label}
        </Typography>
      )}

      {/* 操作按钮 */}
      {selected && !isEditing && (
        <Box
          sx={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            display: 'flex',
            gap: '4px',
            zIndex: 1001,
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Add child button clicked for node:', id);
              data.onAddChild(id);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              width: '24px',
              height: '24px',
              zIndex: 1000,
              '&:hover': { backgroundColor: '#45a049', transform: 'scale(1.1)' }
            }}
          >
            <AddIcon sx={{ fontSize: '14px' }} />
          </IconButton>
          {id !== 'root' && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete button clicked for node:', id);
                data.onDelete(id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                width: '24px',
                height: '24px',
                zIndex: 1000,
                '&:hover': { backgroundColor: '#d32f2f', transform: 'scale(1.1)' }
              }}
            >
              <DeleteIcon sx={{ fontSize: '14px' }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

const MindMapEditor: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mindMapId } = useParams<{ mindMapId: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mindMapTitle, setMindMapTitle] = useState('新思维导图');
  const [mindMapDescription, setMindMapDescription] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [userApiConfig, setUserApiConfig] = useState<any>(null);
  const [currentMindMapId, setCurrentMindMapId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promptMode, setPromptMode] = useState<'simple' | 'standard' | 'advanced'>('standard');
  const [needsFitView, setNeedsFitView] = useState(false);
  const scriptTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const lastLayoutNodesCount = useRef<number>(0);
  const lastLayoutEdgesCount = useRef<number>(0);

  // 颜色配置
  const nodeColors = useMemo(() => [
    '#4285f4', // 蓝色 - 根节点
    '#34a853', // 绿色 - 一级分支
    '#fbbc04', // 黄色 - 二级分支
    '#ea4335', // 红色 - 三级分支
    '#9c27b0', // 紫色 - 四级分支
    '#00bcd4', // 青色 - 五级分支
  ], []);

  // 处理节点编辑
  const handleNodeEdit = useCallback((id: string, newLabel: string) => {
    console.log('handleNodeEdit called:', id, 'new label:', newLabel);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          console.log('Updating node:', id, 'from', node.data.label, 'to', newLabel);
          return { 
            ...node, 
            data: { 
              ...node.data, 
              label: newLabel,
            } 
          };
        }
        return node;
      })
    );
    
    // 如果编辑的是根节点，同时更新思维导图标题
    if (id === 'root') {
      setMindMapTitle(newLabel);
    }
  }, [setNodes]);

  // 处理节点删除
  const handleNodeDelete = useCallback((id: string) => {
    console.log('handleNodeDelete called:', id);
    if (id === 'root') {
      enqueueSnackbar('不能删除根节点', { variant: 'warning' });
      return;
    }

    // 使用一个共享变量来存储要删除的节点
    let nodesToDelete: Set<string>;

    // 首先更新边，并计算要删除的节点
    setEdges((currentEdges) => {
      console.log('Current edges:', currentEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
      
      // 删除节点及其所有子节点
      nodesToDelete = new Set([id]);
      const findChildNodes = (nodeId: string) => {
        currentEdges.forEach(edge => {
          if (edge.source === nodeId && !nodesToDelete.has(edge.target)) {
            nodesToDelete.add(edge.target);
            findChildNodes(edge.target);
          }
        });
      };
      findChildNodes(id);

      console.log('Nodes to delete:', Array.from(nodesToDelete));
      console.log('Total edges before deletion:', currentEdges.length);

      // 过滤掉要删除的边
      const filteredEdges = currentEdges.filter((edge) => 
        !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
      );

      console.log('Remaining edges after deletion:', filteredEdges.length);
      
      return filteredEdges;
    });

    // 然后更新节点
    setNodes((currentNodes) => {
      console.log('Current nodes:', currentNodes.map(n => ({ id: n.id, label: n.data.label })));
      console.log('Total nodes before deletion:', currentNodes.length);

      // 过滤掉要删除的节点
      const filteredNodes = currentNodes.filter((node) => !nodesToDelete.has(node.id));

      console.log('Remaining nodes after deletion:', filteredNodes.length);
      
      return filteredNodes;
    });

    enqueueSnackbar('节点已删除', { variant: 'success' });
  }, [setNodes, setEdges, enqueueSnackbar]);

  // 添加子节点
  const handleAddChild = useCallback((parentId: string) => {
    console.log('Adding child to parent:', parentId);
    
    const newId = `node-${Date.now()}`;
    
    setNodes((currentNodes) => {
      console.log('Current nodes:', currentNodes.map(n => ({ id: n.id, label: n.data.label })));
      
      const parentNode = currentNodes.find(node => node.id === parentId);
      if (!parentNode) {
        console.log('Parent node not found:', parentId);
        console.log('Available nodes:', currentNodes.map(n => n.id));
        enqueueSnackbar('父节点未找到', { variant: 'error' });
        return currentNodes;
      }

      const level = (parentNode.data as MindMapNodeData).level + 1;
      
      // 计算新节点位置
      const childrenCount = currentNodes.filter(n => 
        n.data.level === level && n.id !== newId
      ).length;
      
      const newNode: Node<MindMapNodeData> = {
        id: newId,
        type: 'mindMapNode',
        position: {
          x: parentNode.position.x + 200,  // 减小水平间距
          y: parentNode.position.y + (childrenCount * 60) - (childrenCount * 30),  // 减小垂直间距
        },
        data: {
          label: '新节点',
          level,
          color: nodeColors[Math.min(level, nodeColors.length - 1)],
          onEdit: handleNodeEdit,
          onDelete: handleNodeDelete,
          onAddChild: handleAddChild,
        },
      };

      console.log('Created new node:', newId, 'for parent:', parentId);
      return [...currentNodes, newNode];
    });

    // 添加连接边
    setEdges((currentEdges) => {
      const newEdge: Edge = {
        id: `edge-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        type: 'smoothstep',
        style: { stroke: '#2196f3', strokeWidth: 2 },
      };

      console.log('Created new edge:', newEdge.id);
      return [...currentEdges, newEdge];
    });
    
    enqueueSnackbar('已添加新节点', { variant: 'success' });
  }, [nodeColors, setNodes, setEdges, enqueueSnackbar, handleNodeEdit, handleNodeDelete]);

  // 计算节点实际尺寸的函数
  const calculateNodeSize = useCallback((label: string) => {
    // 基础尺寸
    const minWidth = 120;
    const minHeight = 40;
    const maxWidth = 400;
    const padding = 32; // 左右各16px
    
    // 更精确的字符宽度计算
    const getTextWidth = (text: string) => {
      let width = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        // 中文字符、全角符号等宽度较大
        if (char.match(/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/)) {
          width += 16; // 中文字符宽度
        } else {
          width += 9; // 英文字符宽度
        }
      }
      return width;
    };
    
    const lineHeight = 22; // 稍微增加行高
    
    // 分割成行来计算
    const lines = label.split('\n');
    let maxLineWidth = 0;
    let totalLines = 0;
    
    lines.forEach(line => {
      if (line.trim() === '') {
        // 空行也要计算
        totalLines += 1;
        return;
      }
      
      const lineWidth = getTextWidth(line);
      
      if (lineWidth + padding <= maxWidth) {
        // 单行就能显示
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
        totalLines += 1;
      } else {
        // 需要换行
        maxLineWidth = maxWidth - padding;
        // 估算需要多少行
        const availableWidth = maxWidth - padding;
        let currentLineWidth = 0;
        let linesForThisContent = 1;
        
        for (let i = 0; i < line.length; i++) {
          const char = line.charAt(i);
          const charWidth = char.match(/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/) ? 16 : 9;
          
          if (currentLineWidth + charWidth > availableWidth) {
            linesForThisContent++;
            currentLineWidth = charWidth;
          } else {
            currentLineWidth += charWidth;
          }
        }
        
        totalLines += linesForThisContent;
      }
    });
    
    // 计算最终尺寸
    const width = Math.max(minWidth, Math.min(maxLineWidth + padding, maxWidth));
    const height = Math.max(minHeight, totalLines * lineHeight + 24); // 上下各12px padding
    
    return { width, height };
  }, []);

  // 自动布局函数
  const getLayoutedElements = useCallback((nodes: Node[], edges: Edge[], direction = 'LR') => {
    // 如果节点数量很少，直接返回避免不必要的计算
    if (nodes.length <= 1) {
      return { nodes, edges };
    }

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ 
      rankdir: direction,
      nodesep: isHorizontal ? 50 : 40,     // 进一步增加节点间距
      ranksep: isHorizontal ? 100 : 80,    // 进一步增加层级间距  
      marginx: 30,                         // 增加边距
      marginy: 30,                         // 增加边距
    });

    // 为每个节点计算实际尺寸
    const nodeSizes = new Map<string, { width: number; height: number }>();
    
    nodes.forEach((node) => {
      const nodeData = node.data as MindMapNodeData;
      const size = calculateNodeSize(nodeData.label);
      nodeSizes.set(node.id, size);
      dagreGraph.setNode(node.id, { width: size.width, height: size.height });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const size = nodeSizes.get(node.id) || { width: 220, height: 80 };
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - size.width / 2,
          y: nodeWithPosition.y - size.height / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }, [calculateNodeSize]);



  // 自定义节点类型
  const nodeTypes: NodeTypes = useMemo(() => ({
    mindMapNode: MindMapNode,
  }), []);

  // 获取用户API配置
  const fetchUserApiConfig = useCallback(async () => {
    try {
      const response = await usersApi.getApiConfig();
      setUserApiConfig(response.data);
    } catch (err) {
      console.error('获取API配置失败:', err);
    }
  }, []);

  // 加载思维导图数据
  const loadMindMap = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const response = await mindMapsApi.getById(id);
      if (response.success) {
        const mindMap = response.data;
        setMindMapTitle(mindMap.title);
        setMindMapDescription(mindMap.description || '');
        setCurrentMindMapId(mindMap.mindMapId);
        
                 // 解析节点和边数据
         if (mindMap.nodesData) {
           try {
             const nodesData = JSON.parse(mindMap.nodesData);
             setNodes(nodesData.map((node: any) => ({
               ...node,
               data: {
                 ...node.data,
                 // 如果是根节点，使用思维导图标题作为标签
                 label: node.id === 'root' ? mindMap.title : node.data.label,
                 onEdit: handleNodeEdit,
                 onDelete: handleNodeDelete,
                 onAddChild: handleAddChild,
               }
             })));
           } catch (e) {
             console.error('解析节点数据失败:', e);
           }
         }
        
        if (mindMap.edgesData) {
          try {
            const edgesData = JSON.parse(mindMap.edgesData);
            setEdges(edgesData);
          } catch (e) {
            console.error('解析边数据失败:', e);
          }
        }
        
        enqueueSnackbar('思维导图加载成功', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('加载思维导图失败:', error);
      enqueueSnackbar(error.message || '加载失败', { variant: 'error' });
      navigate('/mindmap/history');
    } finally {
      setIsLoading(false);
    }
  }, [handleNodeEdit, handleNodeDelete, handleAddChild, setNodes, setEdges, enqueueSnackbar, navigate]);

  // 保存思维导图
  const saveMindMap = useCallback(async () => {
    if (!mindMapTitle.trim()) {
      enqueueSnackbar('请输入思维导图标题', { variant: 'warning' });
      return;
    }

    try {
      setIsSaving(true);
      
      const mindMapData: MindMapRequest = {
        title: mindMapTitle.trim(),
        description: mindMapDescription.trim(),
        nodesData: JSON.stringify(nodes),
        edgesData: JSON.stringify(edges),
      };

      let response;
      if (currentMindMapId) {
        // 更新现有思维导图
        response = await mindMapsApi.update(currentMindMapId, mindMapData);
      } else {
        // 创建新思维导图
        response = await mindMapsApi.create(mindMapData);
      }

      if (response.success) {
        setCurrentMindMapId(response.data.mindMapId);
        enqueueSnackbar(
          currentMindMapId ? '思维导图更新成功' : '思维导图保存成功', 
          { variant: 'success' }
        );
        
        // 如果是新创建的，更新URL
        if (!currentMindMapId) {
          navigate(`/mindmap/edit/${response.data.mindMapId}`, { replace: true });
        }
      }
    } catch (error: any) {
      console.error('保存思维导图失败:', error);
      enqueueSnackbar(error.message || '保存失败', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [mindMapTitle, mindMapDescription, nodes, edges, currentMindMapId, enqueueSnackbar, navigate]);

  // 自动滚动到文本框底部
  useEffect(() => {
    if (scriptTextAreaRef.current && isGenerating) {
      const textArea = scriptTextAreaRef.current;
      textArea.scrollTop = textArea.scrollHeight;
    }
  }, [generatedScript, isGenerating]);

  // 初始化根节点或加载现有思维导图
  useEffect(() => {
    if (mindMapId) {
      // 编辑模式：加载现有思维导图
      loadMindMap(parseInt(mindMapId));
          } else {
        // 创建模式：初始化根节点
        const rootNode: Node<MindMapNodeData> = {
          id: 'root',
          type: 'mindMapNode',
          position: { x: 100, y: 300 },
          data: {
            label: mindMapTitle || '新思维导图',
            level: 0,
            color: nodeColors[0],
            onEdit: handleNodeEdit,
            onDelete: handleNodeDelete,
            onAddChild: handleAddChild,
          },
        };

        setNodes([rootNode]);
        setEdges([]);
        console.log('Initialized mind map with root node');
      }
    
    fetchUserApiConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mindMapId]); // 依赖mindMapId变化

  // 自动布局和视图调整函数
  const applyAutoLayoutWithFitView = useCallback((layoutedNodes: Node[], layoutedEdges: Edge[]) => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // 使用 requestAnimationFrame 确保在节点渲染后调用 fitView
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          setNeedsFitView(true);
        } catch (error) {
          console.warn('fitView failed:', error);
        }
      });
    });
  }, [setNodes, setEdges]);

  // 监听节点变化，自动应用水平布局
  useEffect(() => {
    // 跳过初始加载和只有根节点的情况
    if (nodes.length <= 1) return;
    
    // 检查是否真的需要重新布局（避免不必要的重新计算）
    if (lastLayoutNodesCount.current === nodes.length && lastLayoutEdgesCount.current === edges.length) {
      return;
    }
    
    // 使用更短的延迟时间，并使用防抖机制避免频繁触发
    const timeoutId = setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'LR');
      applyAutoLayoutWithFitView(layoutedNodes, layoutedEdges);
      
      // 更新记录的节点和边数量
      lastLayoutNodesCount.current = nodes.length;
      lastLayoutEdgesCount.current = edges.length;
    }, 150); // 减少延迟时间

    return () => clearTimeout(timeoutId);
  }, [nodes.length, edges.length, nodes, edges, getLayoutedElements, applyAutoLayoutWithFitView]); // 重新添加必要的依赖项

  // 生成思维导图内容摘要
  const generateMindMapSummary = () => {
    const summary: string[] = [];
    
    const traverseNode = (nodeId: string, depth: number = 0) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      const indent = '  '.repeat(depth);
      summary.push(`${indent}- ${(node.data as MindMapNodeData).label}`);
      
      // 找到所有子节点
      const childEdges = edges.filter(edge => edge.source === nodeId);
      childEdges.forEach(edge => traverseNode(edge.target, depth + 1));
    };

    traverseNode('root');
    return summary.join('\n');
  };

  // 验证API配置
  const validateApiConfig = (): string | null => {
    if (!userApiConfig) {
      return '请先在用户信息页面配置API设置';
    }
    
    if (!userApiConfig.hasApiKey) {
      return '请在用户信息页面配置API密钥';
    }
    
    if (!userApiConfig.apiBaseUrl?.trim()) {
      return '请在用户信息页面配置API基础URL';
    }
    
    if (!userApiConfig.apiModel?.trim()) {
      return '请在用户信息页面配置API模型';
    }
    
    return null;
  };

  // 调用大模型API生成视频文案
  const generateVideoScript = async () => {
    const validationError = validateApiConfig();
    if (validationError) {
      enqueueSnackbar(validationError, { variant: 'warning' });
      return;
    }

    setIsGenerating(true);
    setGeneratedScript(''); // 清空之前的内容
    setShowScriptDialog(true); // 立即显示对话框
    
    try {
      const mindMapContent = generateMindMapSummary();
      
      // 根据选择的模式生成不同的 prompt
      let prompt: string;
      switch (promptMode) {
        case 'simple':
          prompt = generateSimpleVideoScriptPrompt({ mindMapContent });
          break;
        case 'advanced':
          prompt = generateAdvancedVideoScriptPrompt({ mindMapContent });
          break;
        default:
          prompt = generateVideoScriptPrompt({ mindMapContent });
      }

      await callLLMApiStream(prompt);
      
      // 自动保存思维导图
      try {
        if (!currentMindMapId) {
          await saveMindMap();
        }
        enqueueSnackbar('视频文案生成成功，思维导图已自动保存！', { variant: 'success' });
      } catch (saveError) {
        console.error('自动保存思维导图失败:', saveError);
        enqueueSnackbar('视频文案生成成功，但自动保存失败', { variant: 'warning' });
      }
    } catch (error: any) {
      console.error('生成视频文案失败:', error);
      enqueueSnackbar(error.message || '生成失败，请检查API配置', { variant: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  // 调用大模型API（流式输出）
  const callLLMApiStream = async (prompt: string): Promise<void> => {
    if (!userApiConfig) {
      throw new Error('API配置未找到');
    }
    
    const provider = userApiConfig.apiProvider;
    const baseUrl = userApiConfig.apiBaseUrl;
    const model = userApiConfig.apiModel;
    
    try {
      let url: string;
      let headers: Record<string, string>;
      let body: any;
      
      const cleanBaseUrl = baseUrl?.replace(/\/$/, '') || '';
      
      if (provider === 'openai' || provider === 'custom') {
        if (cleanBaseUrl.includes('/chat/completions')) {
          url = cleanBaseUrl;
        } else if (cleanBaseUrl.includes('/v1')) {
          url = `${cleanBaseUrl}/chat/completions`;
        } else {
          url = `${cleanBaseUrl}/v1/chat/completions`;
        }
        
        // 获取完整的API配置（包含密钥）
        const fullConfigResponse = await usersApi.getFullApiConfig();
        const apiKey = fullConfigResponse.data.apiKey;
        
        if (!apiKey) {
          throw new Error('API密钥未配置');
        }
        
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        
        body = {
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        };
      } else if (provider === 'claude') {
        if (cleanBaseUrl.includes('/v1/messages')) {
          url = cleanBaseUrl;
        } else if (cleanBaseUrl.includes('/v1')) {
          url = `${cleanBaseUrl}/messages`;
        } else {
          url = `${cleanBaseUrl}/v1/messages`;
        }
        
        // 获取完整的API配置（包含密钥）
        const fullConfigResponse = await usersApi.getFullApiConfig();
        const apiKey = fullConfigResponse.data.apiKey;
        
        if (!apiKey) {
          throw new Error('API密钥未配置');
        }
        
        headers = {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        };
        
        body = {
          model: model,
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: true,
        };
      } else {
        throw new Error('不支持的API提供商');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 增加超时时间

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage += `\n错误详情: ${errorData.error.message || errorData.error}`;
            }
          } catch {
            errorMessage += `\n响应内容: ${errorText.substring(0, 300)}`;
          }
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('无法读取响应流');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

            if (trimmedLine.startsWith('data: ')) {
              try {
                const jsonStr = trimmedLine.slice(6);
                const data = JSON.parse(jsonStr);
                
                let content = '';
                if (provider === 'openai' || provider === 'custom') {
                  content = data.choices?.[0]?.delta?.content || '';
                } else if (provider === 'claude') {
                  if (data.type === 'content_block_delta') {
                    content = data.delta?.text || '';
                  }
                }

                if (content) {
                  setGeneratedScript(prev => prev + content);
                  // 强制触发滚动
                  setTimeout(() => {
                    if (scriptTextAreaRef.current) {
                      scriptTextAreaRef.current.scrollTop = scriptTextAreaRef.current.scrollHeight;
                    }
                  }, 0);
                }
              } catch (parseError) {
                console.warn('解析流数据失败:', parseError);
              }
            }
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('API调用超时，请稍后重试');
      }
      throw error;
    }
  };



  // 解析生成的脚本内容
  const parseGeneratedScript = (script: string) => {
    console.log('=== 开始解析脚本 ===');
    console.log('原始脚本内容:', script);
    
    // 先尝试简单的正则表达式方法
    const sections = {
      mainTitle: '',
      alternativeTitle1: '',
      alternativeTitle2: '',
      description: '',
      chapters: [] as Array<{ title: string; content: string }>
    };
    
    // 提取主标题
    const mainTitleMatch = script.match(/\*\*主标题\*\*\s*\n([^\n]+)/);
    if (mainTitleMatch) {
      sections.mainTitle = mainTitleMatch[1].trim();
    }
    
    // 提取备选标题1
    const alt1Match = script.match(/\*\*备选标题1\*\*\s*\n([^\n]+)/);
    if (alt1Match) {
      sections.alternativeTitle1 = alt1Match[1].trim();
    }
    
    // 提取备选标题2
    const alt2Match = script.match(/\*\*备选标题2\*\*\s*\n([^\n]+)/);
    if (alt2Match) {
      sections.alternativeTitle2 = alt2Match[1].trim();
    }
    
    // 提取视频简介
    const descMatch = script.match(/\*\*视频简介\*\*\s*\n([^\n]+)/);
    if (descMatch) {
      sections.description = descMatch[1].trim();
    }
    
    // 提取章节内容 - 使用更精确的正则表达式
    const chapterRegex = /第(\d+)章[:：]([^\n]*)\n((?:(?!第\d+章[:：]|\*\*|格式要求|重要格式要求|严格格式要求)[\s\S]*?)*)/g;
    let chapterMatch;
    
    console.log('开始提取章节...');
    while ((chapterMatch = chapterRegex.exec(script)) !== null) {
      const chapterNumber = chapterMatch[1];
      const chapterTitle = chapterMatch[2].trim();
      const chapterContent = chapterMatch[3].trim();
      
      console.log(`找到第${chapterNumber}章: "${chapterTitle}", 内容长度: ${chapterContent.length}`);
      console.log('章节内容预览:', chapterContent.substring(0, 100) + '...');
      
      if (chapterContent) {
        sections.chapters.push({
          title: chapterTitle || `章节 ${chapterNumber}`,
          content: chapterContent
        });
      }
    }
    
    // 如果正则表达式方法失败，尝试逐行解析
    if (sections.chapters.length === 0) {
      console.log('正则表达式方法失败，尝试逐行解析...');
      
      const lines = script.split('\n');
      let currentChapter: { title: string; content: string } | null = null;
      let collectingContent = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // 检测章节标题
        if (trimmedLine.match(/^第\d+章[:：]/)) {
          // 保存前一个章节
          if (currentChapter && currentChapter.content.trim()) {
            sections.chapters.push({
              title: currentChapter.title,
              content: currentChapter.content.trim()
            });
            console.log('保存章节:', currentChapter.title, '内容长度:', currentChapter.content.length);
          }
          
          // 开始新章节
          const chapterTitle = trimmedLine.replace(/^第\d+章[:：]/, '').trim();
          currentChapter = {
            title: chapterTitle || `章节 ${sections.chapters.length + 1}`,
            content: ''
          };
          collectingContent = true;
          console.log('开始新章节:', currentChapter.title);
          continue;
        }
        
        // 如果遇到新的段落标题，停止收集章节内容
        if (trimmedLine.startsWith('**') || 
            trimmedLine.startsWith('格式要求') ||
            trimmedLine.startsWith('重要格式要求') ||
            trimmedLine.startsWith('严格格式要求')) {
          collectingContent = false;
          continue;
        }
        
        // 收集章节内容
        if (collectingContent && currentChapter) {
          if (currentChapter.content) {
            currentChapter.content += '\n' + line;
          } else {
            currentChapter.content = line;
          }
        }
      }
      
      // 保存最后一个章节
      if (currentChapter && currentChapter.content.trim()) {
        sections.chapters.push({
          title: currentChapter.title,
          content: currentChapter.content.trim()
        });
        console.log('保存最后章节:', currentChapter.title, '内容长度:', currentChapter.content.length);
      }
    }
    
    console.log('=== 解析完成 ===');
    console.log('最终解析结果:', {
      mainTitle: sections.mainTitle,
      alternativeTitle1: sections.alternativeTitle1,
      alternativeTitle2: sections.alternativeTitle2,
      description: sections.description,
      chapters: sections.chapters.map(c => ({ 
        title: c.title, 
        contentLength: c.content.length, 
        contentPreview: c.content.substring(0, 100) + (c.content.length > 100 ? '...' : '') 
      }))
    });
    
    return {
      mainTitle: sections.mainTitle,
      alternativeTitle1: sections.alternativeTitle1,
      alternativeTitle2: sections.alternativeTitle2,
      description: sections.description,
      chapters: sections.chapters,
    };
  };

  // 保存为脚本
  const saveAsScript = async () => {
    try {
      // 首先自动保存思维导图
      if (!currentMindMapId) {
        await saveMindMap();
      }
      
      console.log('=== 开始保存为脚本 ===');
      console.log('原始生成内容:', generatedScript);
      
      // 解析生成的脚本内容
      const parsedContent = parseGeneratedScript(generatedScript);
      console.log('解析后的内容:', parsedContent);
      
      // 将章节数组转换为脚本编辑页面的章节格式
      const scriptChapters = parsedContent.chapters.length > 0 
        ? parsedContent.chapters.map((chapter, index) => {
            console.log(`转换章节 ${index + 1}:`, {
              title: chapter.title,
              contentLength: chapter.content.length,
              contentPreview: chapter.content.substring(0, 100) + '...'
            });
            return {
              chapter_number: index + 1,
              title: chapter.title,
              content: chapter.content,
            };
          })
        : [{
            chapter_number: 1,
            title: '脚本内容',
            content: generatedScript, // 如果解析失败，使用原始内容
          }];
      
      console.log('最终章节数据:', scriptChapters.map(c => ({
        chapter_number: c.chapter_number,
        title: c.title,
        contentLength: c.content.length,
        contentPreview: c.content.substring(0, 50) + '...'
      })));
      
      const navigationState = {
        title: parsedContent.mainTitle || mindMapTitle,
        alternativeTitle1: parsedContent.alternativeTitle1,
        alternativeTitle2: parsedContent.alternativeTitle2,
        description: parsedContent.description,
        chapters: scriptChapters,
        rawContent: generatedScript,
        fromMindMap: true,
        mindMapId: currentMindMapId,
        mindMapTitle: mindMapTitle,
      };
      
      console.log('导航状态数据:', navigationState);
      
      // 导航到脚本创建页面，传递解析后的内容
      navigate('/scripts/create', {
        state: navigationState
      });
    } catch (error: any) {
      console.error('保存脚本失败:', error);
      enqueueSnackbar(error.message || '保存失败', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      backgroundColor: '#fafafa',
      p: 3,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部工具栏 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountTreeIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h5" fontWeight="500">
            思维导图编辑器
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <TextField
            value={mindMapTitle}
            onChange={(e) => {
              const newTitle = e.target.value;
              setMindMapTitle(newTitle);
              // 同时更新根节点的标签
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === 'root'
                    ? { ...node, data: { ...node.data, label: newTitle || '中心主题' } }
                    : node
                )
              );
            }}
            variant="outlined"
            size="small"
            placeholder="思维导图标题"
            sx={{ minWidth: 200 }}
          />
          <TextField
            value={mindMapDescription}
            onChange={(e) => setMindMapDescription(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="思维导图描述（可选）"
            sx={{ minWidth: 250 }}
          />
          <Button
            variant="outlined"
            onClick={() => navigate('/mindmap/history')}
          >
            历史记录
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/users')}
          >
            API配置
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={saveMindMap}
            disabled={isSaving || isLoading}
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={generateVideoScript}
            disabled={isGenerating || nodes.length === 0}
            sx={{ 
              color: 'white',
              '&:hover': { color: 'white' }
            }}
          >
            {isGenerating ? '生成中...' : 'AI生成文案'}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flex: 1, minHeight: 0 }}>
        {/* 左侧工具面板 */}
        <Paper sx={{ width: 300, p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            <PsychologyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            工具面板
          </Typography>
          
          <Stack spacing={2}>
            <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
              <Typography variant="body2" gutterBottom>
                <strong>操作说明：</strong>
              </Typography>
              <Typography variant="body2" component="div">
                • <strong>选中节点</strong>：单击节点显示操作按钮<br/>
                • <strong>编辑节点</strong>：双击节点或文字区域进入编辑模式<br/>
                • <strong>换行输入</strong>：编辑时按 Enter 键换行<br/>
                • <strong>保存编辑</strong>：按 Ctrl+Enter 键或点击其他地方<br/>
                • <strong>取消编辑</strong>：按 Escape 键取消修改<br/>
                • <strong>中心节点</strong>：编辑中心节点会同步更新标题<br/>
                • <strong>绿色+按钮</strong>：添加子分支<br/>
                • <strong>红色×按钮</strong>：删除节点（中心节点不可删除）<br/>
                • <strong>拖拽节点</strong>：调整位置
              </Typography>
            </Alert>
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add main branch clicked, nodes length:', nodes.length);
                handleAddChild('root');
              }}
              fullWidth
            >
              添加主分支
            </Button>
            
            <Divider />
            
            {/* AI 生成模式选择 */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                AI 生成模式
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={promptMode}
                  onChange={(e) => setPromptMode(e.target.value as 'simple' | 'standard' | 'advanced')}
                >
                  <MenuItem value="simple">简化模式</MenuItem>
                  <MenuItem value="standard">标准模式</MenuItem>
                  <MenuItem value="advanced">专业模式</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {promptMode === 'simple' && '快速生成，格式简洁'}
                {promptMode === 'standard' && '标准格式，结构完整'}
                {promptMode === 'advanced' && '专业脚本，详细要求'}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<AccountTreeIcon />}
                onClick={() => {
                  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'LR');
                  applyAutoLayoutWithFitView(layoutedNodes, layoutedEdges);
                  enqueueSnackbar('已应用水平布局', { variant: 'success' });
                }}
                size="small"
                disabled={nodes.length <= 1}
                sx={{ flex: 1 }}
              >
                水平排版
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccountTreeIcon />}
                onClick={() => {
                  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
                  applyAutoLayoutWithFitView(layoutedNodes, layoutedEdges);
                  enqueueSnackbar('已应用垂直布局', { variant: 'success' });
                }}
                size="small"
                disabled={nodes.length <= 1}
                sx={{ flex: 1 }}
              >
                垂直排版
              </Button>
            </Stack>
            
            <Divider />
            <Typography variant="subtitle2" color="text.secondary">
              思维导图统计
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={`总节点: ${nodes.length}`} 
                size="small" 
                variant="outlined" 
              />
              <Chip 
                label={`连接线: ${edges.length}`} 
                size="small" 
                variant="outlined" 
              />
            </Box>

            {!userApiConfig?.hasApiKey && (
              <>
                <Divider />
                <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                  请在用户信息页面配置API密钥以使用AI生成功能
                </Alert>
              </>
            )}
          </Stack>
        </Paper>

        {/* 右侧思维导图画布 */}
        <Paper sx={{ flex: 1, position: 'relative', overflow: 'hidden', height: '100%' }}>
          <Typography variant="h6" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
            思维导图画布
          </Typography>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15, duration: 300 }}
            style={{ width: '100%', height: '100%' }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnScroll={false}
            panOnDrag={true}
            selectNodesOnDrag={true}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Meta"
            onPaneClick={() => {
              // 点击空白区域时取消所有选择
              setNodes((nds) => nds.map((node) => ({ ...node, selected: false })));
            }}
          >
            <FitViewHandler needsFitView={needsFitView} setNeedsFitView={setNeedsFitView} />
            <Controls showInteractive={false} />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>
        </Paper>
      </Box>



      {/* 生成的视频文案对话框 */}
      <Dialog 
        open={showScriptDialog} 
        onClose={() => !isGenerating && setShowScriptDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon />
              {isGenerating ? 'AI正在生成视频文案...' : 'AI生成的视频文案'}
            </Box>
            {isGenerating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  实时生成中
                </Typography>
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={generatedScript}
            onChange={(e) => setGeneratedScript(e.target.value)}
            variant="outlined"
            placeholder={isGenerating ? "正在生成中，请稍候..." : "生成的视频文案将在这里显示..."}
            inputRef={scriptTextAreaRef}
            InputProps={{
              readOnly: isGenerating,
              sx: {
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: isGenerating ? '#f8f9fa' : 'white',
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowScriptDialog(false)}
            disabled={isGenerating}
          >
            关闭
          </Button>
          <Button 
            onClick={saveAsScript}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isGenerating || !generatedScript.trim()}
            sx={{ 
              color: 'white',
              '&:hover': { color: 'white' }
            }}
          >
            保存为脚本
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default MindMapEditor; 