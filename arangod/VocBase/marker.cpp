////////////////////////////////////////////////////////////////////////////////
/// @brief markers
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2004-2013 triAGENS GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is triAGENS GmbH, Cologne, Germany
///
/// @author Jan Steemann
/// @author Copyright 2011-2013, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

#include "marker.h"

// -----------------------------------------------------------------------------
// --SECTION--                                                  public functions
// -----------------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////////////
/// @addtogroup VocBase
/// @{
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// @brief returns the name for a marker
////////////////////////////////////////////////////////////////////////////////

char const* TRI_NameMarker (TRI_df_marker_t const* marker) {
  switch (marker->_type) {
    case TRI_DOC_MARKER_KEY_DOCUMENT:
      return "document";
    case TRI_DOC_MARKER_KEY_EDGE:
      return "edge";
    case TRI_DOC_MARKER_KEY_DELETION:
      return "deletion";
    case TRI_DOC_MARKER_BEGIN_TRANSACTION:
      return "begin transaction";
    case TRI_DOC_MARKER_COMMIT_TRANSACTION:
      return "commit transaction";
    case TRI_DOC_MARKER_ABORT_TRANSACTION:
      return "abort transaction";
    case TRI_DOC_MARKER_PREPARE_TRANSACTION:
      return "prepare transaction";

    case TRI_DF_MARKER_HEADER:
    case TRI_COL_MARKER_HEADER:
      return "header";
    case TRI_DF_MARKER_FOOTER:
      return "footer";
    case TRI_DF_MARKER_ATTRIBUTE:
      return "attribute";
    case TRI_DF_MARKER_SHAPE:
      return "shape";

    case TRI_DOC_MARKER_DOCUMENT:
    case TRI_DOC_MARKER_EDGE:
    case TRI_DOC_MARKER_DELETION:
      return "deprecated";

    case TRI_WAL_MARKER_ATTRIBUTE:
      return "attribute (wal)";
    case TRI_WAL_MARKER_SHAPE:
      return "shape (wal)";
    case TRI_WAL_MARKER_DOCUMENT:
      return "document (wal)";
    case TRI_WAL_MARKER_EDGE:
      return "edge (wal)";
    case TRI_WAL_MARKER_REMOVE:
      return "deletion (wal)";
    case TRI_WAL_MARKER_BEGIN_TRANSACTION:
      return "begin transaction (wal)";
    case TRI_WAL_MARKER_COMMIT_TRANSACTION:
      return "commit transaction (wal)";
    case TRI_WAL_MARKER_ABORT_TRANSACTION:
      return "abort transaction (wal)";

    default:
      return "unused/unknown";
  }
}

////////////////////////////////////////////////////////////////////////////////
/// @brief initialises a marker with the most basic information
////////////////////////////////////////////////////////////////////////////////

void TRI_InitMarker (char* marker,
                     TRI_df_marker_type_e type,
                     TRI_voc_size_t size) {

  TRI_df_marker_t* df = (TRI_df_marker_t*) marker;

  TRI_ASSERT_MAINTAINER(marker != NULL);
  TRI_ASSERT_MAINTAINER(type > TRI_MARKER_MIN && type < TRI_MARKER_MAX);
  TRI_ASSERT_MAINTAINER(size > 0);

  // initialise the basic bytes
  memset(marker, 0, size);

  df->_size = size;
  df->_type = type;
  // not needed because of memset above
  // marker->_crc  = 0;
  // marker->_tick = 0;
}

////////////////////////////////////////////////////////////////////////////////
/// @}
////////////////////////////////////////////////////////////////////////////////

// Local Variables:
// mode: outline-minor
// outline-regexp: "/// @brief\\|/// {@inheritDoc}\\|/// @addtogroup\\|/// @page\\|// --SECTION--\\|/// @\\}"
// End:
