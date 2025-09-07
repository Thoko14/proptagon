# 01-IMPORTANT: How to Use Preservation System & Analysis Files

## 🎯 **For Future AI Interactions**

### **When Starting a New Session**
Always reference these files to give AI context:

```markdown
Please review the current state of the project using:
- `data/docs/MISSING_FUNCTIONALITY_ANALYSIS.md` - What's missing
- `data/docs/DEVELOPMENT_GUIDELINES.md` - How to preserve functionality
- `data/docs/TODO_PRESERVATION_LIST.json` - Current TODO status
```

### **Before Making Changes**
Ask AI to run the preservation script first:

```markdown
Before we make any changes, please:
1. Run `node scripts/preserve-todos.js --list` to see current TODOs
2. Check if any planned functionality might be affected
3. Ensure we don't accidentally delete required features
```

### **When Implementing Features**
Reference the analysis to understand what's needed:

```markdown
I want to implement [specific feature]. Please:
1. Check `MISSING_FUNCTIONALITY_ANALYSIS.md` for related requirements
2. Identify any existing TODO items that need to be implemented
3. Follow the preservation guidelines while making changes
```

## 🛠️ **For Development Workflow**

### **Pre-Development Checklist**
```bash
# 1. Generate current TODO preservation list
node scripts/preserve-todos.js --generate

# 2. List all current TODOs to understand what's planned
node scripts/preserve-todos.js --list

# 3. Check if any TODOs were recently deleted
node scripts/preserve-todos.js --check
```

### **Before Making Changes**
1. **Review the analysis docs** to understand what's missing
2. **Check the preservation list** to see what TODOs exist
3. **Follow the guidelines** to avoid accidental deletions

### **During Development**
1. **Preserve TODO comments** - Add implementation below them
2. **Add FUTURE notes** - Document next enhancement steps
3. **Update documentation** - Reflect changes in relevant docs

### **After Making Changes**
1. **Run the build** - Ensure everything still works
2. **Regenerate preservation list** - Update the TODO tracking
3. **Update analysis docs** - Reflect current implementation status

## 📋 **Specific Usage Scenarios**

### **Scenario 1: Implementing a New Feature**
```markdown
I want to implement property saving functionality. Please:
1. Check `MISSING_FUNCTIONALITY_ANALYSIS.md` section D3 for requirements
2. Look for existing TODO items in `GrowPage.tsx` line 340
3. Follow the implementation pattern in `DEVELOPMENT_GUIDELINES.md`
4. Preserve any existing placeholder code
```

### **Scenario 2: Refactoring Code**
```markdown
I want to refactor the map interaction code. Please:
1. Run `node scripts/preserve-todos.js --list` to see map-related TODOs
2. Check `useMapEvents.ts` for the point-in-polygon TODO
3. Ensure we don't remove any planned functionality
4. Follow the preservation guidelines
```

### **Scenario 3: Adding New Components**
```markdown
I want to add a new property comparison component. Please:
1. Check `MISSING_FUNCTIONALITY_ANALYSIS.md` Epic E for requirements
2. Look for existing compare functionality TODOs
3. Ensure it integrates with existing state management
4. Follow the component patterns in the codebase
```

## 🔍 **Quick Reference Commands**

### **For AI Interactions**
```bash
# Show me current TODO status
node scripts/preserve-todos.js --list

# Generate preservation list for AI context
node scripts/preserve-todos.js --generate

# Check for deleted TODOs
node scripts/preserve-todos.js --check
```

### **For Development**
```bash
# Before starting work
node scripts/preserve-todos.js --generate

# After making changes
npm run build
node scripts/preserve-todos.js --generate
```

## 📝 **Documentation Updates**

### **When Implementing TODOs**
1. **Update the TODO comment** - Mark as implemented
2. **Add FUTURE notes** - Document next steps
3. **Update analysis docs** - Reflect current status
4. **Regenerate preservation list** - Update tracking

### **Example Implementation Pattern**
```typescript
// TODO: Implement save property functionality ✅ IMPLEMENTED
// FUTURE: Add to user favorites/watchlist with persistence
const handleSaveProperty = (propertyId: string) => {
  // Implementation here
  saveToUserFavorites(propertyId);
  showSuccessMessage('Property saved to favorites');
};
```

## 🚨 **Warning Signs to Watch For**

### **Red Flags During Development**
- Large number of TODO deletions
- Removal of placeholder functions
- Deletion of mock data without replacement
- Removal of component props

### **Safe Changes**
- Removing unused imports (without TODO markers)
- Consolidating duplicate code (if original preserved)
- Performance optimizations (if functionality preserved)
- Adding new features (following existing patterns)

## 🎯 **Best Practices**

### **For AI Interactions**
1. **Always provide context** - Reference the analysis docs
2. **Check preservation status** - Run the script before changes
3. **Follow guidelines** - Use the preservation rules
4. **Update documentation** - Keep everything current

### **For Development**
1. **Preserve over delete** - When in doubt, keep functionality
2. **Document changes** - Update TODO status and add FUTURE notes
3. **Test thoroughly** - Ensure builds pass and functionality works
4. **Follow patterns** - Use existing component and hook patterns

## 📞 **Emergency Recovery**

### **If Critical Functionality is Deleted**
```bash
# Check git history for TODO changes
git log -S "TODO:" --oneline

# See what TODOs were in a specific commit
git show <commit-hash> | grep -A 5 -B 5 "TODO:"

# Regenerate preservation list
node scripts/preserve-todos.js --generate
```

## 📊 **Current Project Status**

### **Implementation Status**
- **Total TODOs**: 131 items tracked
- **High Priority**: 51 items (Critical Files)
- **Medium Priority**: 25 items (Future Implementations)
- **Low Priority**: 48 items (Documentation and Infrastructure)

### **Recent Achievements** ✅
- **Map Functionality**: ✅ **COMPLETED** - Optimized hover performance, smooth suburb selection
- **Search Functionality**: ✅ **COMPLETED** - Robust suburb search with autocomplete, state-aware filtering, and geocoding fallback
- **Chip Styling**: ✅ **COMPLETED** - Wider chips (260-320px) with improved icon-to-text spacing (gap-4), better layout and overflow handling
- **Location Chip**: ✅ **COMPLETED** - Properly displays last searched suburb with full location name
- **Performance**: ✅ **COMPLETED** - 60fps hover updates with throttling and caching
- **Duplicate Cleanup**: ✅ **COMPLETED** - Removed unused duplicate files
- **Click Tooltips**: ✅ **COMPLETED** - Suburb detail panels working properly
- **Enter Key Behavior**: ✅ **COMPLETED** - Fixed delayed autocomplete suggestions after search execution

### **Critical Files Protected**
**Frontend Core Files**:
- `platform/src/pages/GrowPage.tsx` ✅ **ACTIVE** - Main Grow page component
- `modules/grow/frontend/components/GrowMap.tsx` ✅ **ACTIVE** - Optimized map with hover performance
- `modules/grow/frontend/components/PropertiesFab.tsx`
- `modules/grow/frontend/components/SuburbToolkit.tsx`

**Note**: Removed unused duplicate files:
- ~~`modules/grow/frontend/GrowPage.tsx`~~ (deleted - was unused duplicate)
- ~~`modules/grow/frontend/components/GrowViewManager.tsx`~~ (deleted - was unused)
- ~~`modules/grow/frontend/hooks/useMapEvents.ts`~~ (functionality consolidated into GrowMap.tsx)

**Backend Core Files**:
- `modules/grow/backend/data/fetch.py`
- `modules/grow/backend/scoring/logic/scoring_algorithms.py`
- `modules/grow/backend/scoring/main.py`

## 🛡️ **Critical Preservation Rules**

### ✅ **DO NOT DELETE (Essential Functionality)**
- **Functions marked with `// TODO: Implement`** - These are required features
- **Components with placeholder implementations** - These are part of the core UI
- **Hooks with incomplete functionality** - These provide essential state management
- **API endpoints returning mock data** - These are placeholders for real data sources
- **Any code marked with `FUTURE:` comments** - These are planned enhancements

### ❌ **SAFE TO REMOVE (Only These)**
- **Unused imports and variables** - Only if they have no TODO markers
- **Duplicate implementations** - Only if the original is preserved
- **Dead code without TODO markers** - Only if it's truly unused

## 🔍 **Recently Preserved Functions**

### **Functions Preserved for Future Implementation**
The following functions are required by the grow-spec.md and should be implemented in `platform/src/pages/GrowPage.tsx`:

1. **`handleSuburbSearch`** - Required by grow-spec.md A1: "Search works from any Grow view"
2. **`handleSuburbSelect`** - Required by grow-spec.md C2: "Row actions: View Suburb"
3. **`handleCenterOnMap`** - Required by grow-spec.md C2: "Row actions: Center on Map" (with polygon highlighting)
4. **`handleShowPropertiesForSuburb`** - Required by grow-spec.md C3: "Right rail CTAs: Show Properties Here"
5. **`handleSaveSearch`** - Required by grow-spec.md D1: "Actions: Save Search"
6. **`handleSetSearchAsDefault`** - Required by grow-spec.md D1: "Actions: Set as Default"
7. **`trackAnalytics`** - Required by grow-spec.md Section 5: Analytics tracking functions

**Note**: These functions should be added to the active `platform/src/pages/GrowPage.tsx` file as needed for future features.

## 🆕 **NEW EPIC H - User Data & Alerts**

### **Epic H Requirements Added to grow-spec.md**

The following new requirements have been added to the grow-spec.md and should be tracked in the TODO system:

### **H1. Persistent Watchlist (High Priority)**
- **Missing**: Persistent storage and management of saved suburbs and properties
- **Location**: `modules/grow/frontend/store/growStore.ts` (extend store)
- **TODO**: Implement persistent watchlist system with API integration

### **H2. Alerts System (High Priority)**
- **Missing**: Price change alerts, new property alerts, strategy match alerts
- **Location**: New alerts infrastructure needed
- **TODO**: Implement comprehensive alerts and notification system

### **H3. Search History & Activity (Medium Priority)**
- **Missing**: Recent searches tracking, activity timeline
- **Location**: New activity tracking system needed
- **TODO**: Implement search history and activity tracking

### **H4. User Activity Dashboard (Medium Priority)**
- **Missing**: Central dashboard for saved items and activity
- **Location**: New dashboard component needed
- **TODO**: Implement user activity dashboard

### **How to Restore These Functions**
When implementing the corresponding features, uncomment these functions and connect them to the appropriate components:

```typescript
// In GrowPage.tsx, uncomment the preserved functions:
// const handleSuburbSearch = (query: string) => { ... };
// const handleSuburbSelect = (suburb: string) => { ... };
// etc.
```

## 🎯 **High Priority Implementation Areas**
- **Location**: `modules/grow/frontend/components/GrowViewManager.tsx`
- **Missing**: Real property data fetching and display
- **Impact**: Core functionality for property discovery

### 2. Map Interaction Enhancement ✅ **COMPLETED**
- **Location**: `modules/grow/frontend/components/GrowMap.tsx`
- **Status**: ✅ **IMPLEMENTED** - Optimized hover performance with throttling and caching
- **Impact**: Smooth suburb selection and highlighting with 60fps performance

### 3. Search Functionality ✅ **COMPLETED**
- **Location**: `modules/grow/frontend/components/GrowTopBar.tsx`
- **Status**: ✅ **IMPLEMENTED** - Robust suburb search with state-aware filtering, geocoding fallback, and proper Enter key behavior
- **Impact**: Accurate suburb discovery and navigation with improved UX

### 4. Chip Layout & Styling ✅ **COMPLETED**
- **Location**: `modules/grow/frontend/components/GrowTopBar.tsx` and `modules/grow/frontend/components/Chip.tsx`
- **Status**: ✅ **IMPLEMENTED** - Wider chips (260-320px) with improved icon-to-text spacing (gap-4), 2-line text support, and proper overflow handling
- **Impact**: Better display of long location names, improved visual balance, and enhanced user experience

### 5. Compare Functionality
- **Location**: `modules/grow/frontend/components/CompareView.tsx`
- **Missing**: Item removal and reordering in compare view
- **Impact**: Core comparison feature

### 6. Property Management
- **Location**: `platform/src/pages/GrowPage.tsx`
- **Missing**: Save and compare property functionality
- **Impact**: User engagement and data persistence

### 7. Suburb Navigation
- **Location**: `modules/grow/frontend/components/GrowMap.tsx`
- **Status**: ✅ **MOSTLY IMPLEMENTED** - `zoomToSuburb` function exists and works for search, point-in-polygon is working via Mapbox's `queryRenderedFeatures`
- **Missing**: Center on map from suburb list (connect SuburbListView "Center" button)
- **Impact**: Map interaction and user experience

## 🆕 **NEW EPIC G - Error Handling & User Experience**

### **Epic G Requirements Added to grow-spec.md**

The following new requirements have been added to the grow-spec.md and should be tracked in the TODO system:

### **G1. Error Recovery & Feedback (High Priority)**
- **Missing**: Toast notifications, error recovery mechanisms, loading states
- **Location**: `modules/grow/frontend/components/` (new components needed)
- **TODO**: Implement toast notification system, error recovery UI, comprehensive loading states

### **G2. Accessibility Compliance (High Priority)**
- **Missing**: WCAG 2.1 AA compliance, screen reader support, keyboard navigation
- **Location**: All components need accessibility improvements
- **TODO**: Add ARIA labels, semantic HTML, keyboard navigation, focus management

### **G3. Performance Requirements (Medium Priority)**
- **Missing**: Virtual scrolling, progressive image loading, code splitting
- **Location**: `modules/grow/frontend/components/` (performance optimization)
- **TODO**: Implement virtual scrolling for large lists, optimize image loading, add code splitting

### **G4. Mobile Experience (Medium Priority)**
- **Missing**: Touch gestures, bottom sheet navigation, GPS integration
- **Location**: `modules/grow/frontend/components/` (mobile enhancements)
- **TODO**: Add touch gestures for map, implement bottom sheets, integrate GPS

### **G5. Data Validation & Security (High Priority)**
- **Missing**: Real-time validation, input sanitization, security headers
- **Location**: All form components and API endpoints
- **TODO**: Implement comprehensive form validation, add security measures

### **G6. Advanced Search & Discovery (Medium Priority)**
- **Missing**: Boolean operators, complex filters, AI suggestions
- **Location**: `modules/grow/frontend/components/GrowTopBar.tsx`
- **TODO**: Enhance search with advanced operators, add AI-powered suggestions

### **G7. Real-Time Features (Low Priority)**
- **Missing**: Live updates, push notifications, WebSocket integration
- **Location**: New real-time infrastructure needed
- **TODO**: Implement WebSocket connections, add push notifications

### **G8. Internationalization (Low Priority)**
- **Missing**: Multi-language support, currency localization, RTL support
- **Location**: New i18n infrastructure needed
- **TODO**: Add translation system, implement currency/date formatting

### **G9. Analytics & Insights (Medium Priority)**
- **Missing**: User behavior tracking, market insights, A/B testing
- **Location**: New analytics infrastructure needed
- **TODO**: Implement analytics tracking, add insights dashboard

### **G10. Security & Privacy (High Priority)**
- **Missing**: GDPR compliance, MFA, role-based access, encryption
- **Location**: Authentication and data handling systems
- **TODO**: Implement GDPR compliance, add MFA, enhance security

## 🔧 **Recent Technical Improvements**

### **Search System Enhancements** ✅ **COMPLETED**
- **State-Aware Search**: Implemented proper state filtering for suburbs with same names (e.g., "Red Hill, QLD" vs "Red Hill, VIC")
- **Geocoding Fallback**: Added fallback to Mapbox geocoding when suburbs aren't found in local GeoJSON data
- **Enter Key Behavior**: Fixed delayed autocomplete suggestions by implementing `searchExecutedRef` flag system
- **Performance**: Optimized search with proper debouncing and suggestion filtering
- **Search Accuracy**: Improved suburb detection with better filtering of roads/landmarks vs actual suburbs
- **Autocomplete UX**: Enhanced suggestion prioritization and display with proper icons and formatting

### **Map Performance Optimizations** ✅ **COMPLETED**
- **Hover Throttling**: Implemented 16ms throttling for smooth 60fps hover updates
- **Distance-Based Filtering**: Added 5px distance check to prevent unnecessary hover updates
- **Consolidated Updates**: Created `updateHoverHighlight` helper to reduce redundant Mapbox API calls
- **Memory Management**: Proper cleanup of timeouts and event listeners
- **Point-in-Polygon**: ✅ **COMPLETED** - Using Mapbox's `queryRenderedFeatures` for accurate suburb detection on click and hover

### **UI/UX Improvements** ✅ **COMPLETED**
- **Chip Layout**: Increased chip width to 260-320px for better text display and improved icon-to-text spacing
- **Icon Spacing**: Enhanced gap between icons and text (gap-4) for better visual balance
- **Text Overflow**: Implemented 2-line text support with CSS line-clamp for long location names
- **Visual Consistency**: Improved spacing and layout of chip container with better padding and gaps
- **Responsive Design**: Better handling of different text lengths and states
- **Location Display**: Location chip properly shows last searched suburb with full location information

### **Code Architecture Improvements** ✅ **COMPLETED**
- **Consolidated Map Logic**: Moved all map functionality into single `GrowMap.tsx` component
- **Removed Duplicates**: Cleaned up unused duplicate files (`GrowPage.tsx`, `GrowViewManager.tsx`)
- **TypeScript Safety**: Fixed all TypeScript errors and improved type definitions
- **Error Handling**: Added proper error boundaries and fallback mechanisms

## 🚀 **Future Development Roadmap**

### Phase 1: Core Data Integration
1. Implement real property data fetching
2. Connect to backend APIs
3. Replace mock data with real sources

### Phase 2: Enhanced Interactions ✅ **COMPLETED**
1. ✅ **COMPLETED**: Implement proper map interactions (optimized hover, click tooltips)
2. ✅ **COMPLETED**: Robust search functionality with autocomplete and state-aware filtering
3. ✅ **COMPLETED**: Chip layout improvements with better text handling
4. Add advanced comparison features
5. Enhance property management

### Phase 3: Advanced Features
1. Implement AI-powered recommendations
2. Add comprehensive error tracking
3. Enhance user feedback systems

### Phase 4: Epic G Implementation (New)
1. **G1-G2 (High Priority)**: Error handling, accessibility compliance
2. **G3-G4 (Medium Priority)**: Performance optimization, mobile experience
3. **G5-G6 (Medium Priority)**: Data validation, advanced search
4. **G7-G10 (Low Priority)**: Real-time features, i18n, analytics, security

### Phase 5: Epic H Implementation (New)
1. **H1-H2 (High Priority)**: Persistent watchlist, alerts system
2. **H3-H4 (Medium Priority)**: Search history, user activity dashboard

## 📞 **Support and Questions**

### When in Doubt
1. **Check the analysis docs** - `data/docs/MISSING_FUNCTIONALITY_ANALYSIS.md`
2. **Run the preservation script** - `node scripts/preserve-todos.js --list`
3. **Review git history** - Check what was previously implemented
4. **Consult the spec** - `data/docs/grow-spec.md`

### Emergency Recovery
If critical functionality is accidentally deleted:
1. **Check git history** - `git log -S "TODO:" --oneline`
2. **Restore from backup** - Use git revert or checkout
3. **Regenerate preservation list** - `node scripts/preserve-todos.js --generate`
4. **Update documentation** - Reflect the recovery

## 🎯 **Current Working State**

### **✅ Fully Functional Features**
- **Map Interaction**: Smooth hover highlighting, click tooltips, suburb selection
- **Search System**: Robust suburb search with autocomplete, state-aware filtering, geocoding fallback
- **UI Components**: Responsive chip layout, proper text overflow handling, clean visual design
- **Performance**: Optimized hover updates (60fps), efficient search debouncing, proper memory management

### **🔄 Partially Implemented Features**
- **Suburb Navigation**: `zoomToSuburb` function works for search, point-in-polygon working, but needs integration with suburb list "Center" button
- **Property Management**: Basic structure exists but needs real data integration
- **Compare Functionality**: UI components exist but need item management features

### **📋 Next Priority Items**
1. **Real Data Integration**: Connect to property APIs and backend services
2. **Property Management**: Implement save/compare functionality with persistence
3. **Compare Features**: Add item removal and reordering capabilities
4. **Epic G Implementation**: Error handling, accessibility, and performance optimizations
5. **Epic H Implementation**: User data, alerts, and activity tracking

## 🏁 **Summary**

These files create a **safety net** for development:

- **`MISSING_FUNCTIONALITY_ANALYSIS.md`** - Your roadmap of what needs to be built
- **`DEVELOPMENT_GUIDELINES.md`** - Your rulebook for safe development
- **`preserve-todos.js`** - Your tool for tracking and protecting functionality
- **`TODO_PRESERVATION_LIST.json`** - Your current status snapshot

**Key Principle**: These files ensure that every TODO represents planned functionality that users expect. Treat them as requirements, not suggestions, and always preserve rather than delete when uncertain.

This system will help you and AI assistants work together safely while building out the complete Proptagon functionality! 🚀

---

## 📋 **Quick Start Commands**

```bash
# Generate current TODO preservation list
node scripts/preserve-todos.js --generate

# List all current TODOs
node scripts/preserve-todos.js --list

# Check for deleted TODOs
node scripts/preserve-todos.js --check

# Build the project
npm run build
```

## 🎯 **For New AI Sessions**

Simply reference this document:

```markdown
Please review `data/docs/01-IMPORTANT.md` for:
- Current project status and preservation rules
- How to use the TODO preservation system
- Critical files that must be protected
- Implementation guidelines and best practices
``` 